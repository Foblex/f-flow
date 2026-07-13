---
publishedAt: "2026-07-13"
updatedAt: "2026-07-13"
---

# Foblex Flow v19.1.0: Managed State, Faster Large Flows, and Shadow DOM Support

v19.0 opened up how a Foblex Flow editor can be driven: configurable control schemes, click-to-connect, keyboard editing, and one connector model. v19.1 focuses on what happens after those interactions begin changing a real application: where the graph state lives, how one gesture becomes one undo step, and how the runtime behaves as the editor grows or moves behind a Shadow DOM boundary.

Today I'm shipping **v19.1.0** with three main changes:

- **Managed Flow State** - an opt-in, typed graph store installed with `withFlowState()`, including automatic updates from supported gestures, batched undo/redo, viewport history, and persistable snapshots.
- **Faster large flows** - targeted connection redraws, model-space minimap geometry, batched registry notifications, cached connector geometry, and less work in drag hot paths.
- **Angular Elements and Shadow DOM support** - pointer gestures and coordinate hit-testing now cross open shadow roots without changing normal DOM targeting behavior.

There are no breaking changes in this release. Managed state is opt-in, and Shadow DOM support requires no additional provider.

## Managed State Without a Forced Data Shape

Foblex Flow has traditionally emitted interaction events and left the application to update its own arrays or store. That model is still supported and remains useful when an editor already has a domain-specific state architecture.

But it also means every application has to write the same coordination layer: update positions after a drag, add a connection after a create event, keep selection and canvas state in sync, and make several events from one gesture become one history entry.

v19.1 adds an opt-in path for applications that want that coordination built in:

```ts
import { Component } from '@angular/core';
import { IFStateNode, injectFlowState, provideFFlow, withFlowState } from '@foblex/flow';

interface WorkflowNode extends IFStateNode {
  label: string;
  kind: 'trigger' | 'action';
}

@Component({
  providers: [provideFFlow(withFlowState())],
})
export class WorkflowEditor {
  protected readonly state = injectFlowState<WorkflowNode>();

  constructor() {
    this.state.load({
      nodes: [],
      groups: [],
      connections: [],
    });
  }
}
```

The records stay flat and application-shaped. Extend `IFStateNode`, `IFStateGroup`, or `IFStateConnection` with your own fields; there is no required `data` wrapper. `injectFlowState<TNode, TConnection, TGroup>()` keeps those records typed through reads, mutations, history, and snapshots.

The template renders the signals directly:

```html
@for (node of state.nodes(); track node.id) {
  <div fNode [fNodeId]="node.id" [fNodePosition]="node.position">
    {{ node.label }}
  </div>
}

@for (connection of state.connections(); track connection.id) {
  <f-connection
    [fConnectionId]="connection.id"
    [fSourceId]="connection.sourceId"
    [fTargetId]="connection.targetId"
  />
}
```

The application still owns what the records mean, how they are validated, and where `snapshot()` is persisted. The new state layer owns the repetitive editor bookkeeping. Applications that need different rules can supply a custom `stateClass` and override the store behavior instead of forking the interaction pipeline.

::: ng-component <flow-state></flow-state> [height]="600"
:::

## One Gesture, One History Action

The difficult part of undo/redo is not keeping old arrays. It is deciding where an action starts and ends.

A node drag can select the node first, emit several position updates, move descendants through a group transform, resize an auto-fit group, and finish by reparenting the node. Those are separate runtime events, but they are one action from the user's point of view. v19.1 batches them into one history item, so one `undo()` reverts the complete gesture.

Managed state v1 automatically handles:

- connection creation and endpoint reassignment
- node and group movement, including multi-selection drags
- selection changes
- deletion of rendered nodes, groups, and connections
- external palette drops through a configurable `nodeFactory`
- optional drop-to-group reparenting
- canvas pan and zoom, with configurable debounce
- immutable programmatic `add*`, `update*`, `remove*`, and `moveNodes` calls

`state.changes()` increments when the outer batch settles, not once per internal event. That gives persistence and collaboration code one stable notification for the completed action:

```ts
effect(() => {
  this.state.changes();
  this.persist(untracked(() => this.state.snapshot()));
});
```

Selection and canvas transforms are part of history by default, and both can be disabled independently. `historyLimit` caps retained entries, while `batch(work)` lets application code combine several mutations into the same history step.

## Viewport History and Initialization

Viewport state is where undo systems often become surprising. A user's pan or zoom is a real interaction and is recorded by default, but initial centering is usually application setup and should not become the first undo item.

`resetScaleAndCenter`, `fitToScreen`, and `centerGroupOrNode` now accept an optional `emitCanvasChange` argument. Pass `false` for initial or application-driven viewport changes that should stay out of history:

```ts
flow.resetScaleAndCenter(false, false);
```

Undoing back to the initial loaded state also reruns the full-render lifecycle, so applications that center from `fFullRendered` receive the same lifecycle signal instead of waiting for an unrelated node change.

## Explicit v1 Boundaries

Managed state v1 does not automatically capture rotation, connection waypoint editing, or user resize. Their existing public outputs still fire, so applications can update the managed records themselves when those interactions are enabled.

Connection cascade during programmatic removal uses the rendered connector registry to resolve ownership. If an application removes a node before its connectors render, such as immediately after `load()` or during SSR, it should remove the known connection ids in the same `state.batch(...)` call.

Drop-to-group has two independent switches:

- `fDropToGroup` enables or disables the gesture and remains enabled by default for compatibility.
- `withFlowState({ dropToGroup: true })` allows managed state to apply the emitted reparenting and defaults to `false`.

That separation prevents enabling the state plugin from silently changing an application's grouping rules.

## Less Runtime Work in Large Editors

The second part of v19.1 is internal, but it targets work that shows up directly in frame time as diagrams grow.

### Connections redraw only when affected

A node geometry change no longer schedules every connection in the flow. The redraw request carries the changed node id and redraws only connections attached to that geometry.

Groups needed extra care here. Moving a group changes the rendered position of every descendant even though the descendants' model positions remain local to the group. The scoped redraw now includes connections owned by descendant nodes, which keeps grouped moves and undo/redo restores correct without falling back to a full redraw.

### The minimap reads model geometry

The minimap previously measured node elements during redraw. It now maintains model-space rectangles keyed by node id and reconciles them after batched registry updates. Repainting the minimap no longer requires a DOM measurement for every node.

### Drag and registry hot paths do less repeated work

- Pointer targeting resolves through DOM ancestry instead of scanning every registered node.
- Connector border radii are cached instead of calling `getComputedStyle()` for repeated geometry normalization.
- Connectable-side recalculation uses one shared scheduler across drag handlers.
- Component-store notifications are coalesced, and registry removals are processed in batches.
- Drag gesture priority is an explicit claim chain, reducing duplicated preparation work between competing interactions.

These are implementation changes rather than new configuration. Existing editors receive them automatically.

## Angular Elements and Open Shadow DOM

Foblex Flow can now run inside an open shadow root created by Angular Elements or `ViewEncapsulation.ShadowDom`. The supported path covers node and canvas dragging, click-to-connect, connection target resolution, external item drops, and background detection.

The targeting behavior is deliberately conservative:

- In normal DOM, interaction code continues to use `event.target` first.
- When Shadow DOM retargets a document-level event to the custom-element host, the runtime falls back to the event's composed path to recover the element inside the flow.
- Coordinate hit-testing follows `elementsFromPoint()` into nested open shadow roots while preserving the browser's native hit order.

This avoids making `composedPath()` the primary targeting model for every application. The fallback only participates when the normal target no longer identifies an element inside the flow.

Closed shadow roots remain unsupported because the browser intentionally hides their internal tree from outside code. No configuration flag can make deep hit-testing enter a closed root.

This work addresses [GitHub Discussion #315](https://github.com/Foblex/f-flow/discussions/315).

## Group Auto-Size and Undo Correctness

The state work exposed several ordering bugs around groups and render restoration, and those fixes ship for every editor:

- `fAutoSizeToFitChildren` waits until child parent ids have settled before measuring the group.
- The final auto-fit size emits through `fNodeSizeChange` / `fGroupSizeChange` so external and managed stores see the same geometry.
- Clearing a bound size removes stale explicit width and height.
- Combining `fAutoExpandOnChildHit` with auto-fit no longer emits a transient soft-expanded size before the settled size.
- Connections attached to descendants redraw after a group move or state restore.

The result is that undo restores the graph as one coherent visual state: group, descendants, connections, selection, and viewport no longer settle on different frames.

## Documentation and Starter Updates

The release also adds a maintained zoneless Angular starter under `starters/minimal-flow` for StackBlitz, expands the v19 README and package metadata, and adds comparison and use-case pages for teams evaluating Angular diagram libraries.

The dedicated [Managed Flow State guide](https://flow.foblex.com/examples/state) contains the complete API, configuration table, v1 limitations, and a working example. Applications that prefer to own the entire history layer can continue using the existing event-driven APIs.

## Upgrade Notes

- There are no breaking changes in v19.1.0.
- Existing event-driven state integrations keep working; `withFlowState()` is opt-in.
- Existing light-DOM flows keep the same target-first event behavior.
- Open Shadow DOM support is automatic; closed roots remain unsupported.
- Applications using initial centering with managed viewport history should pass `emitCanvasChange: false` through the new method argument.
- Applications enabling managed drop-to-group must opt in with `withFlowState({ dropToGroup: true })`.

## Closing

v19.1 is about making the newer interaction architecture practical in production editors. Managed state removes coordination code without taking ownership of application meaning. The performance work reduces repeated DOM and redraw work as graphs grow. Shadow DOM support lets the same editor live behind Angular Elements without a second interaction implementation.

If you are building a visual editor in Angular and want the library to manage the common graph interaction history, start with the Managed Flow State example. If you already have a store, upgrade for the runtime, grouped redraw, and Shadow DOM improvements without changing your state architecture.

## Release Links

- Release: <https://github.com/Foblex/f-flow/releases/tag/v19.1.0>
- Changelog: <https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md>
- Managed Flow State example: <https://flow.foblex.com/examples/state>
- Roadmap: <https://flow.foblex.com/docs/roadmap>
- Shadow DOM discussion: <https://github.com/Foblex/f-flow/discussions/315>
