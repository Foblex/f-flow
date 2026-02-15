# Drag and Drop

## Description

`FDraggableDirective` enables user interactions on a flow surface: node drag, canvas pan, connection create/reassign, selection, and drag plugins.

- **Selector:** `f-flow[fDraggable]`
- **Class:** `FDraggableDirective`

**What you get**

- Unified pointer pipeline for all drag-related interactions.
- Configurable trigger predicates for each operation.
- Rich event outputs for selection, move, create/reassign, and plugin results.

## Why / Use cases

Use `fDraggable` when users need to manipulate the diagram directly.

Typical use cases:

- Workflow editors with drag-to-connect and reassign.
- Canvas navigation by drag and touch gestures.
- Advanced editors that react to drag lifecycle events (`fDragStarted`/`fDragEnded`).

Skip `fDraggable` for strictly read-only diagrams.

## How it works

The directive attaches to `f-flow`, initializes a drag sequence on pointer down, dispatches operation-specific handlers (selection, node move, connection create/reassign, resize/rotate plugins), and finalizes with event emission and cleanup.

## Configuration (Inputs/Outputs/Methods)

### Inputs

- `fDraggableDisabled: boolean;` Disables all drag interactions. Default: `false`.
- `fMultiSelectTrigger: FEventTrigger;` Multi-select trigger (Ctrl/Meta by default).
- `fReassignConnectionTrigger: FEventTrigger;`
- `fCreateConnectionTrigger: FEventTrigger;`
- `fConnectionWaypointsTrigger: InputSignal<FEventTrigger>;`
- `fMoveControlPointTrigger: FEventTrigger;`
- `fNodeResizeTrigger: FEventTrigger;`
- `fNodeRotateTrigger: FEventTrigger;`
- `fNodeMoveTrigger: FEventTrigger;`
- `fCanvasMoveTrigger: FEventTrigger;`
- `fExternalItemTrigger: FEventTrigger;`
- `fEmitOnNodeIntersect: boolean;` Emit node/connection intersection events. Default: `false`.
- `vCellSize: InputSignal<number>;` Vertical grid step. Default: `1`.
- `hCellSize: InputSignal<number>;` Horizontal grid step. Default: `1`.
- `fCellSizeWhileDragging: InputSignal<boolean>;` Apply cell snapping during drag. Default: `false`.

### Outputs

- `fSelectionChange: EventEmitter<FSelectionChangeEvent>;`
- `fNodeConnectionsIntersection: OutputEmitterRef<FNodeConnectionsIntersectionEvent>;`
- `fNodeIntersectedWithConnections: EventEmitter<FNodeIntersectedWithConnections>;` Deprecated.
- `fCreateNode: EventEmitter<FCreateNodeEvent>;`
- `fMoveNodes: EventEmitter<FMoveNodesEvent>;`
- `fReassignConnection: EventEmitter<FReassignConnectionEvent>;`
- `fCreateConnection: EventEmitter<FCreateConnectionEvent>;`
- `fConnectionWaypointsChanged: OutputEmitterRef<FConnectionWaypointsChangedEvent>;`
- `fDropToGroup: EventEmitter<FDropToGroupEvent>;`
- `fDragStarted: EventEmitter<FDragStartedEvent>;`
- `fDragEnded: EventEmitter<void>;`

### Methods

- No public template API methods.

## Styling

- `.f-dragging` Active drag state class.
- `.f-connections-dragging` Active connection drag/reassign state class.
- `.f-connector-connectable` Marks connectors that are valid current targets.

## Notes / Pitfalls

- The directive must be applied on `f-flow`, not on `f-canvas`.
- Aggressive custom trigger functions can block expected interactions; test mouse and touch.
- If you emit large state updates on every drag event, UI can stutter; debounce heavy side effects in your app layer.

## Example

::: ng-component <drag-start-end-events></drag-start-end-events> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
