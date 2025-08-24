# Drag and Drop

**Selector:** [fDraggable] 

The **FDraggableDirective** enhances a component, typically a flow [f-flow](f-flow-component), with draggable functionality. It allows elements within the flow to be moved and managed interactively.

## Inputs

  - `fDraggableDisabled: InputSignal<boolean>;` Determines whether the draggable functionality is disabled. Default: `false`.

  - `vCellSize: InputSignal<number>;` Defines the vertical size of each grid cell. Default: `1`.

  - `hCellSize: InputSignal<number>;` Defines the horizontal size of each grid cell. Default: `1`.

## Outputs

 - `fSelectionChange: EventEmitter<FSelectionChangeEvent>;` Emits an event when the selection within the flow changes.

 - `fNodeIntersectedWithConnections: EventEmitter<FNodeIntersectedWithConnections>;` Emits an event when node is dragged and released over a connection.  

 - `fCreateNode: EventEmitter<FCreateNodeEvent>;` Emits an event when an external item, marked with the [FExternalItemDirective](f-external-item-directive), is dragged into the flow, allowing for node creation.

 - `fReassignConnection: EventEmitter<FReassignConnectionEvent>;` Emits an event when a connection is reassigned to a different [FNodeInputDirective](f-node-input-directive).

 - `fCreateConnection: EventEmitter<FCreateConnectionEvent>;` Emits an event when a new connection is created within the flow. To do this you need to pull a connection from [fOutput](f-node-output-directive) to [fInput](f-node-input-directive).

 - `fDropToGroup: EventEmitter<FDropToGroupEvent>;` Emits an event when a node or group is dropped into a node or group.

## Properties

 - `isDragStarted: boolean;` Indicates whether a drag operation has started within the flow. This property is used to track the state of drag interactions.

## Styles

  - `.f-draggable` Applied to the host element to indicate it is draggable.

  - `.f-drag-disabled` Applied when the draggable functionality is disabled.

  - `.f-drag-started` Applied when a drag operation begins.

## Usage

```html
<f-flow |:|fDraggable|:|></f-flow>
```
