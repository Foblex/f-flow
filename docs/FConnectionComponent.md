**Selector**: f-connection

##### Description

The **FConnectionComponent** is a component that represents a connection between nodes in a flow. It allows customization of the connection's appearance and behaviour, including color, type, and interactivity.

##### Inputs

* `id: string;` The unique identifier for the component instance. Automatically generated. 
Default: f-connection-${uniqueId++}

* `disabled: boolean;` Indicates whether the connection is disabled. Default: false

* `fStartColor: string;` The color at the start of the connection. Default: black

* `fEndColor: string;` The color at the end of the connection. Default: black

* `fOutputId: string;` The identifier of the [FNodeOutputDirective](#FNodeOutputDirective) where the connection starts.

* `fInputId: string;` The identifier of the [FNodeInputDirective](#FNodeInputDirective) where the connection ends.

* `fBehavior: EFConnectionBehavior;` The behaviour of the connection, affecting its positioning and flexibility. Accepts a value from **EFConnectionBehavior** enum. Default: EFConnectionBehavior.FIXED

* `fType: EFConnectionType;` The visual type of the connection, such as straight, bezier and etc. Accepts a value from **EFConnectionType** enum. Default: EFConnectionType.STRAIGHT

* `fText: string;` The text displayed on the connection. Default: null

##### Styles

> `.f-component` A general class applied to all F components for shared styling.

> `.f-connection` Class specific to the connection component, providing styles for connection representation.

> `.f-connection-disabled` Class applied to the connection when it is disabled.

> `.f-selected` Class applied to the connection when it is selected.

##### Usage

```html
<f-connection [fOutputId]="outputNodeId" [fInputId]="inputNodeId"></f-connection>
```

