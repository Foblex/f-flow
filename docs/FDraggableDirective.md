**Selector**: f-flow[fDraggable]

##### Description

The **FDraggableDirective** enhances a component, typically a flow ([f-flow](#FFlowComponent)), with draggable functionality. It allows elements within the flow to be moved and managed interactively.

##### Inputs

* `fDraggableDisabled: boolean;` Determines whether the draggable functionality is disabled. Default: false

##### Outputs

* `fSelectionChange: EventEmitter<FSelectionChangeEvent>;` Emits an event when the selection within the flow changes.

* `fConnectionIntersectNode: EventEmitter<FConnectionIntersectNodeEvent>;` Emits an event when an unconnected node is dragged and released over a connection.

* `fCreateNode: EventEmitter<FCreateNodeEvent>;` Emits an event when an external item, marked with the [FExternalItemDirective](#FExternalItemDirective), is dragged into the flow, allowing for node creation.

* `fReassignConnection: EventEmitter<FReassignConnectionEvent>;` Emits an event when a connection is reassigned to a different [FNodeInputDirective](#FNodeInputDirective).

* `fCreateConnection: EventEmitter<FCreateConnectionEvent>;` Emits an event when a new connection is created within the flow.

##### Properties

* `isDragStarted: boolean;` Indicates whether a drag operation has started within the flow. This property is used to track the state of drag interactions.

##### Styles

> `.f-draggable` Applied to the host element to indicate it is draggable.

> `.f-drag-disabled` Applied when the draggable functionality is disabled.

> `.f-drag-started` Applied when a drag operation begins.

##### Usage

```html
<f-flow fDraggable></f-flow>
```

