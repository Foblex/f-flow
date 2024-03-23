**Selector**: f-flow

##### Description

The **FFlowComponent** manages the flow of draggable and connectable elements within a visual canvas. It allows for dynamic creation, positioning, and interaction of elements, supporting features such as element connections, layout calculation, and event handling.

##### Inputs

* `fFlowId: string;` The unique identifier for the component instance. Automatically generated. Default: f-flow-${uniqueId++}

##### Outputs

* `fLoaded: EventEmitter<void>;`  Emits an event when the component has fully loaded and initialized.

##### Methods

* `getNodesRect(): IRect;` Returns the bounding rectangle of all nodes in the flow.

##### Styles

> `.f-component` A general class applied to all F components for shared styling.

> `.f-flow` Specifically targets the FFlowComponent, allowing for unique styling.

##### Usage

```html
<f-flow [id]="customId" (fLoaded)="loaded()"></f-flow>
```
