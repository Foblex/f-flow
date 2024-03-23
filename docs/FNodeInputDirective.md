**Selector**: [fNodeInput]

##### Description

The **FNodeInputDirective** is a directive designed to mark an element as an input within a node ([fNode](#FNodeDirective)). It manages input-specific behaviours, such as allowing multiple connections, handling disabled state, and determining connectability.

##### Inputs

* `fInputId: string;` The unique identifier for the directive instance. Automatically generated. Default: f-node-input-${uniqueId++}

* `fInputDisabled: boolean;` Indicates whether the input is disabled. A disabled input may have a different visual representation and interaction behavior. Default: false
* `fInputMultiple: boolean;` Determines whether the input allows multiple connections. Default: true
* `fInputConnectableSide: EFConnectableSide;` **MISSING**. Default: EFConnectableSide.AUTO

##### Properties

* `isConnected: boolean;` Indicates whether the input is connected.

##### Styles

> `.f-component` A general class applied to all F components for shared styling.

> `.f-node-input` Specific class for styling the node input element.

> `.f-node-input-disabled` Applied when the input is disabled.

> `.f-node-input-multiple` Applied when the input allows multiple connections.

> `.f-node-input-not-connectable` Applied when the input is not connectable.

> `.f-node-input-connected` Applied when the input is connected, indicating an active connection.

##### Usage

```html
  <div fNode>
     <div fNodeInput></div> 
  </div> 
```
