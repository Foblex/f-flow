# Drag and Drop

**Selector:** `f-flow[fDraggable]`  
**Class:** `FDraggableDirective`

`FDraggableDirective` enables user interactions on a flow surface: node drag, canvas pan, connection create/reassign, selection, and drag plugins.

## Why / Use cases

Use `fDraggable` when users need to manipulate the diagram directly.

Typical use cases:

- Workflow editors with drag-to-connect and reassign.
- Canvas navigation by drag and touch gestures.
- Advanced editors that react to drag lifecycle events (`fDragStarted`/`fDragEnded`).

Skip `fDraggable` for strictly read-only diagrams.

## How it works

The directive attaches to `f-flow`, initializes a drag sequence on pointer down, dispatches operation-specific handlers (selection, node move, connection create/reassign, resize/rotate plugins), and finalizes with event emission and cleanup.

## API

### Inputs

- `fDraggableDisabled: boolean;` Default: `false`. Disables all drag interactions.
- `fDropToGroup: boolean;` Default: `true`. Enables the drop-to-group gesture. While on, the flow carries the `f-drop-to-group` CSS class so the grouping styles apply, dragging a node onto a group reparents it, and a dropped external item nests into the container under the pointer. Set it to `false` and none of that happens — no `fDropToGroup` event is emitted.
- `fMultiSelectTrigger: FEventTrigger;` Default: `(event) => isMac ? event.metaKey : event.ctrlKey`. Trigger for multi-selection.
- `fReassignConnectionTrigger: FEventTrigger;` Default: the active [control scheme](control-scheme)'s `reassignConnection` (`always`). Trigger for reassigning connections.
- `fCreateConnectionTrigger: FEventTrigger;` Default: the active [control scheme](control-scheme)'s `createConnection` (`always`). Trigger for creating connections.
- `fConnectionWaypointsTrigger: FEventTrigger;` Default: `always`. Trigger for moving connection waypoints.
- `fMoveControlPointTrigger: FEventTrigger;` Default: `always`. Trigger for moving control points (bezier).
- `fNodeResizeTrigger: FEventTrigger;` Default: the active [control scheme](control-scheme)'s `nodeResize` (`always`). Trigger for resizing nodes.
- `fNodeRotateTrigger: FEventTrigger;` Default: the active [control scheme](control-scheme)'s `nodeRotate` (`always`). Trigger for rotating nodes.
- `fNodeMoveTrigger: FEventTrigger;` Default: the active [control scheme](control-scheme)'s `nodeMove` (`always`). Trigger for moving nodes.
- `fCanvasMoveTrigger: FEventTrigger;` Default: the active [control scheme](control-scheme)'s `canvasMove` (primary button). Trigger for panning the canvas.
- `fExternalItemTrigger: FEventTrigger;` Default: `always`. Trigger for dragging external items.
- `fEmitOnNodeIntersect: boolean;` Default: `false`. Whether to emit node intersection events.
- `vCellSize: number;` Default: `1`. Vertical grid snapping size.
- `hCellSize: number;` Default: `1`. Horizontal grid snapping size.
- `fCellSizeWhileDragging: boolean;` Default: `false`. Apply grid snapping during drag.

### Outputs

- `fSelectionChange: EventEmitter<FSelectionChangeEvent>;` Emits when selection changes.
- `fNodeConnectionsIntersection: OutputEmitterRef<FNodeConnectionsIntersectionEvent>;` Emits when a node intersects with connections.
- `fCreateNode: EventEmitter<FCreateNodeEvent>;` Emits when a new node is created (e.g. from external item).
- `fMoveNodes: EventEmitter<FMoveNodesEvent>;` Emits when nodes are moved.
- `fReassignConnection: EventEmitter<FReassignConnectionEvent>;` Emits when a connection is reassigned.
- `fCreateConnection: EventEmitter<FCreateConnectionEvent>;` Emits when a new connection is created.
- `fConnectionWaypointsChanged: OutputEmitterRef<FConnectionWaypointsChangedEvent>;` Emits when connection waypoints change.
- `fDropToGroup: EventEmitter<FDropToGroupEvent>;` Emits when items are dropped into a group.
- `fDeleteSelected: EventEmitter<FDeleteSelectedEvent>;` Emits when the user requests removal of the current selection (keyboard `Delete`/`Backspace`). In the default stateless mode, remove the items from your data. The optional [Managed Flow State](./examples/state) plugin handles this supported gesture automatically while the event still fires.
- `fDragStarted: EventEmitter<FDragStartedEvent>;` Emits when a drag sequence starts.
- `fDragEnded: EventEmitter<void>;` Emits when a drag sequence ends.

### Methods

- No public template API methods.

### Types

#### FEventTrigger

```typescript
type FEventTrigger = (event: FTriggerEvent) => boolean;
type FTriggerEvent = MouseEvent | TouchEvent | WheelEvent;
```

#### FSelectionChangeEvent

```typescript
interface FSelectionChangeEvent {
  nodeIds: string[];
  groupIds: string[];
  connectionIds: string[];
}
```

#### FDragStartedEvent

```typescript
interface FDragStartedEvent<TData = unknown> {
  kind: string;
  data?: TData;
}
```

## Styling

- `.f-dragging` Active drag state class.
- `.f-connections-dragging` Active connection drag/reassign state class.
- `.f-connector-connectable` Marks connectors that are valid current targets.

## Notes / Pitfalls

- The directive must be applied on `f-flow`, not on `f-canvas`.
- Aggressive custom trigger functions can block expected interactions; test mouse and touch.
- If you emit large state updates on every drag event, UI can stutter; debounce heavy side effects in your app layer.
- Use [`f-auto-pan`](f-auto-pan-component) to add edge-based viewport scrolling for supported drags.
- See the [Auto Pan example](./examples/auto-pan) for a dedicated configuration playground.

## Example

::: ng-component <drag-start-end-events></drag-start-end-events> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/drag-start-end-events/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/drag-start-end-events/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/drag-start-end-events/example.scss
:::
