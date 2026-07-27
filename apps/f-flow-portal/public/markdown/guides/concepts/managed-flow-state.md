---
publishedAt: "2026-07-27"
updatedAt: "2026-07-27"
---

# Managed Flow State

Foblex Flow supports two explicit state models. The default remains event-driven: the application renders its own records, handles final interaction events, and writes the result to its own store. The opt-in `withFlowState()` feature manages graph record bookkeeping, supported gesture writeback, snapshots, selection, viewport state, and undo/redo.

In both modes, your application still owns domain meaning, validation, permissions, backend integration, and the decision about when and where to persist.

## Choose the mode deliberately

| Choose                    | When it fits                                                                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Classic event-driven mode | You already have an NgRx, signal, service, collaborative, or backend-synchronized graph store and want Foblex Flow to remain the rendering and interaction layer. |
| Managed Flow State        | You want typed graph records and editor history without wiring every supported gesture to application mutations yourself.                                         |

Managed state is never installed implicitly. Enable it for one flow through the component provider:

```ts
import { Component } from '@angular/core';
import {
  FFlowModule,
  IFStateConnection,
  IFStateNode,
  injectFlowState,
  provideFFlow,
  withFlowState,
} from '@foblex/flow';

interface WorkflowNode extends IFStateNode {
  label: string;
}

interface WorkflowConnection extends IFStateConnection {
  condition?: string;
}

@Component({
  selector: 'app-workflow-editor',
  imports: [FFlowModule],
  providers: [provideFFlow(withFlowState())],
  templateUrl: './workflow-editor.html',
})
export class WorkflowEditor {
  protected readonly state = injectFlowState<WorkflowNode, WorkflowConnection>();

  constructor() {
    this.state.load({
      nodes: [
        { id: 'start', label: 'Start', position: { x: 40, y: 80 } },
        { id: 'finish', label: 'Finish', position: { x: 320, y: 80 } },
      ],
      connections: [
        { id: 'start-finish', sourceId: 'start-out', targetId: 'finish-in' },
      ],
    });
  }
}
```

Render those records with normal Angular templates and the current unified connector API:

```html
<f-flow fDraggable>
  <f-canvas
    [position]="state.transform().position"
    [scale]="state.transform().scale"
  >
    @for (connection of state.connections(); track connection.id) {
      <f-connection
        [fConnectionId]="connection.id"
        [fSourceId]="connection.sourceId"
        [fTargetId]="connection.targetId"
      />
    }

    @for (node of state.nodes(); track node.id) {
      <div fNode [fNodeId]="node.id" [fNodePosition]="node.position">
        {{ node.label }}

        <span
          fConnector
          [fConnectorId]="node.id + '-out'"
          fConnectorType="source"
          fConnectorConnectableSide="right"
        ></span>
        <span
          fConnector
          [fConnectorId]="node.id + '-in'"
          fConnectorType="target"
          fConnectorConnectableSide="left"
        ></span>
      </div>
    }
  </f-canvas>
</f-flow>
```

## What the plugin writes automatically

Supported completed gestures update the managed records and normally become one history item:

- connection creation and endpoint reassignment;
- node and group movement, including a multi-selection drag;
- deletion requested by the interaction or accessibility layer;
- external palette item creation;
- optional drop-to-group reparenting;
- selection;
- canvas pan and zoom.

Node and group geometry emitted through `fNodeSizeChange` / `fGroupSizeChange`, including user resize and auto-expand or auto-fit updates, is synchronized into the current records without creating a separate history item. Arbitrary content measurement that does not emit one of those outputs is not written to the store.

Programmatic mutations use the same history:

```ts
this.state.batch(() => {
  this.state.addNodes(node);
  this.state.addConnections(connection);
});

this.state.undo();
this.state.redo();
```

Use `batch()` for synchronous work. Use the paired `beginBatch()` and `endBatch()` APIs when one user action crosses an asynchronous render or `ResizeObserver` turn.

## Persistence

`snapshot()` returns plain arrays plus the current selection and canvas transform. `load()` restores those slices and resets the history:

```ts
const snapshot = this.state.snapshot();
localStorage.setItem('workflow', JSON.stringify(snapshot));

const saved = localStorage.getItem('workflow');
if (saved) {
  this.state.load(JSON.parse(saved));
}
```

Treat persistence as application work: choose the storage format, schema version, migrations, authorization, and backend synchronization outside the canvas library.

## Configuration

```ts
provideFFlow(
  withFlowState({
    historyLimit: 100,
    selectionInHistory: false,
    canvasTransformInHistory: true,
    canvasTransformDebounce: 350,
    dropToGroup: true,
  }),
);
```

- `historyLimit` defaults to `50`.
- `selectionInHistory` controls whether undo/redo walks selection changes. Selection is still included in snapshots.
- `canvasTransformInHistory` controls whether pan and zoom enter undo/redo. The transform is still tracked for persistence.
- `canvasTransformDebounce` defaults to `350ms` so a wheel or pinch sequence becomes one settled history item.
- `connectionFactory` and `nodeFactory` can shape or reject records created by gestures.
- `stateClass` installs an `FFlowState` subclass when application-specific mutation behavior is required.

## Current v1 boundaries

Managed state v1 does not automatically capture rotation or connection waypoint editing. Handle their existing final outputs and update the relevant record yourself. Node and group resize is synchronized automatically, but it amends the current state rather than creating a standalone undo step.

Connections reference connector ids rather than owner node ids. Before connectors render, including immediate mutations after `load()` or during SSR, the live connector ownership registry is unavailable. If you remove a node in that phase, calculate and remove its attached connection ids inside the same batch.

## Continue

- [Open the complete Managed Flow State example](./examples/state).
- [Read the event system for classic application-owned state](event-system).
- [Review node resize output handling](f-resize-handle-directive).
- [Review connection waypoint persistence](f-connection-waypoints-component).
