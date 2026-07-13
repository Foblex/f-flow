---
toc: false
wideContent: true
publishedAt: "2026-07-07"
updatedAt: "2026-07-13"
---

# Managed Flow State

## Description

`provideFFlow(withFlowState())` turns on the graph state built into Foblex Flow. The application loads plain data once, renders the `nodes`, `groups` and `connections` signals with `@for`, and reads the data back whenever it needs to persist — there is not a single gesture handler in the component below.

Your records are your own shape: extend the framework interface with any fields — no `data` wrapper.

```ts
interface MyNode extends IFStateNode {
  text: string; // your fields live right on the record
}

@Component({
  providers: [provideFFlow(withFlowState())],
})
export class Editor {
  protected readonly state = injectFlowState<MyNode>();

  constructor() {
    this.state.load({ nodes: [...], groups: [...], connections: [...] });
  }
}
```

```html
@for (group of state.groups(); track group.id) {
  <div fGroup [fGroupId]="group.id" [fGroupPosition]="group.position" [fGroupSize]="group.size"></div>
}
@for (node of state.nodes(); track node.id) {
  <div fNode [fNodeId]="node.id" [fNodePosition]="node.position" [fNodeParentId]="node.parentId">
    {{ node.text }}
  </div>
}
@for (connection of state.connections(); track connection.id) {
  <f-connection [fConnectionId]="connection.id" [fSourceId]="connection.sourceId" [fTargetId]="connection.targetId" />
}
```

Drag an item from the palette to add a node, drop a node into the group to nest it, drag between connectors to wire them, or select and press `Delete`: these supported gestures land in the state as undoable steps without component event handlers.

## Example

::: ng-component <flow-state></flow-state> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/flow-state/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/flow-state/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/flow-state/example.scss
:::

## Gestures apply themselves

The controller forwards the supported finished gestures into the store. All events belonging to one drag session are batched into one undoable history step:

- **Create connection** — dragging from a connector to a target adds a connection record with a generated id; dropping into empty space adds nothing.
- **Reassign connection** — dragging an endpoint to another connector updates `sourceId`/`targetId`.
- **Move nodes** — a drag (including a multi-selection drag) writes all new positions as a single step, so one `undo()` returns the whole group.
- **Delete selection** — the removal request (e.g. the `Delete` key from the [accessibility layer](./docs/accessibility)) removes selected records. Because this gesture runs against a rendered flow, the connector registry is available and attached connections cascade with their nodes/groups.
- **Drop into a group** — grouping is opt-in: it's off by default, so this example enables it with `withFlowState({ dropToGroup: true })`. With it on, dropped nodes and groups get the group's id as `parentId`; leave it off and the drop is a no-op and external items land at the top level.
- **External item drop** — an item dragged from a palette becomes a node at the drop position, with the item's `fData` spread onto the node as its own fields; dropped over a group it's nested there (because this example opted into `dropToGroup`).
- **Pan / zoom the canvas** — the viewport transform is captured into `state.transform()` and is undoable by default. Bind the canvas `[position]`/`[scale]` to `state.transform()` (as this example does) so `undo`/`redo` move the view back. Set `withFlowState({ canvasTransformInHistory: false })` to keep pan/zoom out of history — it's still tracked and saved in `snapshot()` either way. `position` starts `undefined` (before any transform), which leaves `[position]` free for the initial `resetScaleAndCenter`.
- **Programmatic view changes** — pass `false` as the `emitCanvasChange` argument to `resetScaleAndCenter`, `fitToScreen` or `centerGroupOrNode` when a library-driven move must stay out of state history. This example initializes the viewport with `resetScaleAndCenter(false, false)`.
- **Undo back to the start** — when `undo` returns to the beginning of history, the flow's `reset()` re-runs the full-render lifecycle, so the app's `fFullRendered` handler (`resetScaleAndCenter` here) runs again.
- **Debounce the recording** — a zoom fires a burst of changes; `withFlowState({ canvasTransformDebounce: 200 })` collapses the burst into a single undo step once it settles (a drag pan already folds into one step).

### Scope of v1

Managed state v1 does not capture rotation, connection waypoint editing, or user resize. Those interactions continue to update the rendered directives and emit their normal public outputs; applications that enable them must update their own records. Library-driven size measurement and group auto-fit may amend the current stored geometry, but they do not create a separate user history step.

## Undo/Redo built in

- `state.undo()` / `state.redo()` walk the history; `canUndo` / `canRedo` are signals, ready for `[disabled]` bindings.
- Records are updated immutably, so a history entry is just an object reference — history is cheap regardless of graph size.
- `withFlowState({ historyLimit: 100 })` caps the stack (default 50); the oldest steps fall off.
- `load()` replaces the whole graph and resets the history — ideal for opening a document; `clearHistory()` keeps the data and drops only the steps.
- One drag session is one step. When a single gesture ends with several events — a move plus a drop into a group, or (with `selectionInHistory`) a selection plus a move — they are folded into a single undoable action, so one `undo` reverts the whole thing.

## Reacting to changes

`state.changes()` ticks when a standalone mutation or an outer batch settles, and on `undo`, `redo` or `load`. A multi-event gesture such as selection plus move increments it once when the gesture finishes. Depend on it from a single `effect` to react to anything that touches the graph, without wiring one listener per gesture:

```ts
effect(() => {
  this.state.changes();                          // depend on "something changed"
  this.persist(untracked(() => this.state.snapshot()));
});
```

The store changes its collection signals immediately while a gesture is in progress, but delays the `changes()` increment until the outer batch closes. Standalone mutations notify immediately. The per-collection signals (`nodes()`, `groups()`, `connections()`, `selection()`) remain available when you only care about one slice.

## Data in, data out

- `load({ nodes, groups, connections })` — plain arrays in. The store only reads the framework keys (`id`, `position`, optional `size`, `rotate`, `parentId`) and carries the rest of your record through untouched — put your fields right on it, no `data` wrapper.
- Groups are their own collection with the same shape, rendered with `fGroup` — a first-class kind because the library treats them separately (a group id in a selection, its own drop target). Nesting is just `parentId`.
- `snapshot()` — plain arrays out (`nodes`, `groups`, `connections`) with copied geometry; persist the result as-is.
- `injectFlowState<MyNode, MyConnection, MyGroup>()` types all three end to end; each argument defaults to the framework shape, so `injectFlowState<MyNode>()` is enough when only nodes carry extra fields.

## Configuration

| Option                     | Default                           | Meaning                                                                              |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| `historyLimit`             | `50`                              | Maximum number of undo steps.                                                        |
| `selectionInHistory`       | `true`                            | Include selection in undo/redo; a drag's leading selection is batched with the move. |
| `canvasTransformInHistory` | `true`                            | Include user pan/zoom in undo/redo. The transform is still tracked when disabled.    |
| `canvasTransformDebounce`  | `0`                               | Debounce canvas events before committing a viewport history step.                    |
| `dropToGroup`              | `false`                           | Reparent dropped records and nest external items into groups.                        |
| `connectionFactory`        | generated id/endpoints            | Create or veto a gesture-created connection.                                         |
| `nodeFactory`              | payload plus normalized drop rect | Create or veto a node dropped from an external palette.                              |
| `stateClass`               | `FFlowState`                      | Install an application subclass that overrides store behavior.                       |

## Core API

| API                                       | Purpose                                                                           |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| `nodes`, `groups`, `connections`          | Readonly collection signals rendered by the template.                             |
| `selection`, `transform`                  | Current selection and canvas transform signals.                                   |
| `canUndo`, `canRedo`, `changes`           | History availability and settled-change notification signals.                     |
| `load(data)`, `snapshot()`                | Replace/reset the store and export persistable data.                              |
| `getNode`, `getGroup`, `getConnection`    | Read one record by id.                                                            |
| `add*`, `update*`, `remove*`, `moveNodes` | Programmatic immutable mutations.                                                 |
| `undo`, `redo`, `clearHistory`            | History operations.                                                               |
| `batch(work)`                             | Collapse synchronous mutations into one undo step and one `changes()` increment.  |
| `beginBatch()`, `endBatch()`              | Keep one transaction open across asynchronous work such as content-driven reflow. |

## Selection, and whether it belongs in the history

`state.selection()` always reflects the current selection (`nodeIds`, `groupIds`, `connectionIds`) as a signal — handy for a properties panel or a context menu. Whether selecting is _undoable_ is a config switch, because editors disagree:

```ts
withFlowState({ selectionInHistory: false });
```

- On by default — every selection change is its own step and `undo`/`redo` restore the previous highlight (Figma, Photoshop); a drag's leading selection folds into the same step as the move.
- Set `false` to keep selection out of the history, so `undo` walks only graph edits (xyflow, tldraw).

## Programmatic editing shares the same history

Everything the gestures do is also available as methods — and every call is one undoable step:

```ts
state.addNodes({ id: 'n3', position: { x: 400, y: 80 }, text: 'New' });
state.updateNode('n3', { position: { x: 420, y: 90 } });
state.moveNodes([{ id: 'a', position }, { id: 'b', position }]); // one step (nodes and groups)
state.addConnections({ id: 'c1', sourceId: 'n3-out', targetId: 'a-in' });
state.updateConnection('c1', { targetId: 'b-in' });

state.addGroups({ id: 'g1', position: { x: 0, y: 0 }, size: { width: 300, height: 200 } });
state.updateGroup('g1', { size: { width: 360, height: 240 } });
state.removeGroups(['g1']); // children are un-parented

state.removeNodes(['n3']);
state.removeItems(nodeIds, connectionIds); // combined removal, one step

state.batch(() => {
  state.addNodes(node);
  state.addConnections(edge); // several mutations, one undo step
});
```

## Keep expand/collapse and async reflow in one undo step

Expanding a node can produce two state changes that belong to one user action:

1. The application stores `isExpanded` immediately.
2. Angular renders the larger node, `ResizeObserver` runs `withReflowOnResize`, and the plugin emits the resulting node positions through `fMoveNodes` on a later rendering turn.

`batch(() => ...)` only covers synchronous work, so it closes before the reflow positions arrive. Use `beginBatch()` and `endBatch()` to keep the same transaction open across the render boundary. The state controller applies the reflow `fMoveNodes` event automatically while that transaction is still open:

```ts
function afterResizeObserverTurn(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function setExpanded(nodeId: string, isExpanded: boolean): Promise<void> {
  state.beginBatch();

  try {
    state.updateNode(nodeId, { isExpanded });
    await afterResizeObserverTurn();
  } finally {
    state.endBatch();
  }
}
```

The first mutation records the shape from before the click. Any positions emitted by reflow amend that same history entry, and the outer `endBatch()` produces one `changes()` tick. One `undo()` therefore restores both the collapsed/expanded value and every node moved by reflow.

Two animation frames are appropriate when the size change is rendered immediately: the first lets Angular update and measure the DOM, and the second lets the `ResizeObserver`-driven move settle. If the node size depends on a CSS transition, lazy content, or another asynchronous layout step, close the batch from that operation's real completion signal instead. Always pair `beginBatch()` with `endBatch()` in `finally`; leaving a batch open would merge later, unrelated edits into the same history item.

If the expand/collapse control is nested inside an `fDragHandle`, add `fDragBlocker` to that control. Otherwise the pointer down can select the node before the click handler runs. With `selectionInHistory: true`, that selection is correctly recorded as its own undo item, so the user action appears to require an extra undo even though expand and reflow are already batched together.

The [Call Center Flow](./examples/call-center) uses this pattern when its embedded node forms expand and collapse. The [Reflow on Resize](./examples/reflow-on-resize) guide explains how the layout move itself is calculated.

### Connection cascade requires rendered connectors

Connections store connector ids (`sourceId`/`targetId`), not owner node ids. While the flow is rendered, the controller resolves each connector to its node/group and `removeNodes`/`removeGroups` automatically remove attached connections. Before connector directives have registered (for example, programmatic editing immediately after `load()` or during SSR), that ownership map does not exist.

When removing records before render, compute the attached connection ids from your data and delete both inside one batch:

```ts
state.batch(() => {
  state.removeConnections(attachedConnectionIds);
  state.removeNodes(['n3']);
});
```

## Shaping and vetoing gesture results

For light-touch control, pass factories to the config — return `null` to reject:

```ts
withFlowState({
  connectionFactory: (event) =>
    isAllowed(event) ? { id: uuid(), sourceId: event.sourceId, targetId: event.targetId! } : null,
  nodeFactory: (event) => ({
    ...event.data,
    id: uuid(),
    position: { x: event.externalItemRect.x, y: event.externalItemRect.y },
  }),
});
```

## Every behavior is overridable

If a default does not fit, subclass the store — any CRUD method, any `apply*` gesture handler, any protected building block — and install your class. The auto-wiring dispatches through it:

```ts
@Injectable()
export class MyFlowState extends FFlowState<MyNode> {
  // Change what a gesture means for your data
  override applyDeleteSelected(event: FDeleteSelectedEvent): void {
    // e.g. soft-delete: mark records instead of removing them
  }

  // Change a mutation itself
  override moveNodes(positions: { id: string; position: IPoint }[]): void {
    super.moveNodes(positions.map(snapToGrid));
  }

  // Custom mutations become undoable through the protected commit()
  archiveNode(id: string): void {
    const shape = this.currentShape();
    // ...build the next shape...
    this.commit(nextShape);
  }
}
```

```ts
providers: [provideFFlow(withFlowState({ stateClass: MyFlowState }))];
```

## When to use it

- Use the state plugin when you want the library to do the data bookkeeping: forms-over-flows, quick editors, AI-generated integrations that expect a `nodes[]`/`edges[]`-style API.
- Keep the classic event-driven approach when the graph lives inside a larger application store you already maintain — every event keeps working exactly as before; the plugin is optional and additive.

## Related examples

- [Cut/Copy/Paste](./examples/copy-paste)
- [Add Node From Palette](./examples/add-node-from-palette)
