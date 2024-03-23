**Selector**: [fNode]

##### Description

The **FNodeDirective** is a directive that represents a node within a flow of elements. It is capable of interacting with other nodes and connectors, and can be dynamically positioned and styled.

##### Inputs

* `fNodeId: string;` The unique identifier for the directive instance. Automatically generated. Default: f-node-${uniqueId++}

* `fNodePosition: IPoint;` Sets the position of the node. Redraws the node when the position changes.
* `disabled: boolean;` Indicates whether the node is disabled. A disabled node may have a different visual representation and interaction behaviour. Default: false

##### Outputs

* `fNodePositionChange: EventEmitter<IPoint>;` Emits an event when the position of the node changes.

##### Methods

* `refresh(): void;` Refreshes the state of the node, typically triggering a re-render or update.

##### Styles

> `.f-component` A general class applied to all F components for shared styling.

> `.f-node` Class specific to the node directive, providing styles for node representation.

> `.f-node-disabled` Class applied to the node when it is disabled.

> `.f-selected` Class applied to the node when it is selected.

##### Usage

```html
<div fNode [fNodePosition]="{ x: 100, y: 200 }" [fNodeId]="customNodeId"></div>
```

