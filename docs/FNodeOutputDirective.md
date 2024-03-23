**Selector**: [fNodeOutput]

##### Description

The  **FNodeOutputDirective**  is a directive that marks an element as an output within a node ([fNode](#FNodeDirective)). It manages the output-related behaviors, such as connection status and disabled state.

##### Inputs

* `fOutputId: string;` The unique identifier for the directive instance. Automatically generated. `Default: f-node-output-${uniqueId++}`

* `fOutputDisabled: boolean;` Indicates whether the output is disabled. A disabled output may have a different visual representation and interaction behaviour. `Default: false`
* `fOutputConnectableSide: EFConnectableSide;` Indicates the side of the output where the connection can be created. Accepts a value from `EFConnectableSide` enum. `Default: EFConnectableSide.AUTO`

##### Properties

* `isConnected: boolean;` Indicates whether the output is connected.

##### Styles

> `.f-component` A general class applied to all F components for shared styling.

> `.f-node-output` Specific class for styling the node output element.

> `.f-node-output-disabled` Applied when the output is disabled.

> `.f-node-output-connected` Applied when the output is connected, indicating an active connection.

##### Usage

```html
<div fNode>
    <div fNodeOutput></div>
</div> 
```

