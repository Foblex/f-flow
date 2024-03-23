**Selector**: [fNodeOutlet]

##### Description

The **FNodeOutletDirective** is a directive used within a node ([fNode](#FNodeDirective)) to centralize the creation of connections. It allows dragging connections from a single outlet point rather than individual outputs. When a connection is made to an input, the library automatically links it to the first available output in the node.

##### Inputs

* `fOutletId: string;` The unique identifier for the directive instance. Automatically generated. Default: f-node-outlet-${uniqueId++}

* `fOutletDisabled: boolean;` Indicates whether the outlet is disabled. A disabled outlet may have a different visual representation and interaction behavior. Default: false

* `isConnectionFromOutlet: boolean;` This input determines the visual origin of the connection process. When set to true, connections are visually drawn from the outlet itself, providing a centralized point for initiating connections. If set to false, even though the outlet is used for creating connections, the visual representation shows the connection being drawn directly from the individual output. Default: false

##### Styles

> `.f-component` A general class applied to all F components for shared styling.

> `.f-node-outlet` Specific class for styling the node outlet element.

> `.f-node-outlet-disabled` Applied when the outlet is disabled.

##### Usage

```html
<div fNode [fNodePosition]="{ x: 100, y: 100 }">
    <div fNodeOutput fOutputId="output-1"></div>
    <div fNodeOutlet fOutletId="outlet-1"></div>
</div>
```

