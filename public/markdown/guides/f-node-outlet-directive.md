# Outlet

**Selector:** [fNodeOutlet]

The **FNodeOutletDirective** is a directive that marks an element as an output within a [fNode](f-node-directive) to centralize the creation of connections. It allows dragging connections from a single outlet point rather than individual outputs. When a connection is made to an input, the library automatically links it to the first available output in the node.

## Inputs

  - `fOutletId: InputSignal<string>;` The unique identifier for the directive instance. Automatically generated. Default: `f-node-outlet-${uniqueId++}`

  - `fOutletDisabled: InputSignal<boolean>;` Indicates whether the outlet is disabled. A disabled outlet may have a different visual representation and interaction behavior. Default: `false`

  - `isConnectionFromOutlet: InputSignal<boolean>;` This input determines the visual origin of the connection process. When set to true, connections are visually drawn from the outlet itself, providing a centralized point for initiating connections. If set to false, even though the outlet is used for creating connections, the visual representation shows the connection being drawn directly from the individual output. Default: `false`

## Styles

  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-node-outlet` Specific class for styling the node output element.

  - `.f-node-outlet-disabled` Applied when the output is disabled.

## Usage

```html
<f-flow>
  <f-canvas>
    <div fNode>
      |:|<div fNodeOutput fOutputId="output-1"></div>|:|
      |:|<div fNodeOutlet fOutletId="outlet-1"></div>|:|
    </div>
  </f-canvas>
</f-flow>
```

## Examples

Example of how to use the **FNodeOutletDirective** directive. In this example **isConnectionFromOutlet** is set to `true`.
::: ng-component <connection-from-outlet></connection-from-outlet>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-from-outlet/connection-from-outlet.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-from-outlet/connection-from-outlet.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-from-outlet/connection-from-outlet.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::
