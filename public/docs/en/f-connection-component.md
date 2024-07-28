**Selector:** f-connection

The **FConnectionComponent** is a component that represents a connection between nodes in a flow. It allows customization of the connection's appearance and behaviour, including color, type, and interactivity.  

## Inputs

  - `id: string;` The unique identifier for the component instance. Automatically generated. Default: `f-connection-${uniqueId++}` 

  - `fReassignDisabled: boolean;` Indicates whether the connection cannot be reassigned. Default: `false`. 

  - `fSelectionDisabled: boolean;` Indicates whether the connection cannot be selected. Default: `false`. 

  - `fStartColor: string;` The color at the start of the connection. Default: `black`.

  - `fEndColor: string;` The color at the end of the connection. Default: `black`. 

  - `fOutputId: string;` The identifier of the [FNodeOutputDirective](f-node-output-directive) where the connection starts.  

  - `fInputId: string;` The identifier of the [FNodeInputDirective](f-node-input-directive) where the connection ends.  

  - `fBehavior: EFConnectionBehavior;` The behaviour of the connection, affecting its positioning and flexibility. Accepts a value from [EFConnectionBehavior](e-f-connection-behaviour) enum. Default: `EFConnectionBehavior.FIXED`

  - `fType: EFConnectionType | string;` The visual type of the connection, such as straight, bezier and etc. Accepts a value from [EFConnectionType](e-f-connection-type) enum or string for custom connection. Default: `EFConnectionType.STRAIGHT` 

  - `fText: string;` The text displayed on the connection. Default: `null`

## Styles
  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-connection` Class specific to the connection component, providing styles for connection representation.

  - `.f-connection-selection-disabled` Class applied to the connection when `fSelectionDisabled` is `true`.

  - `.f-connection-reassign-disabled` Class applied to the connection when `fReassignDisabled` is `true.

  - `.f-selected` Class applied to the connection when it is selected.

## Usage

Add the `f-connection` component to the [f-canvas](f-canvas-component). Provide the `fOutputId` and `fInputId` inputs to specify the start and end points of the connection.

```html
<f-flow>
  <f-canvas>
    |:|<f-connection [fOutputId]="id1" [fInputId]="id2"></f-connection>|:|
  </f-canvas>
</f-flow>
```

## Examples

Examples of different connection types. The connection type can be set using the `fType` input. Valid values are `straight`, `bezier` and `segment from [EFConnectionType](e-f-connection-type) enum.
::: ng-component <connection-type></connection-type>
[component.html] <<< src/demo/app/simple-flow/simple-flow.component.html
[component.ts] <<< src/demo/app/simple-flow/simple-flow.component.ts
[component.scss] <<< src/demo/app/simple-flow/simple-flow.component.scss
:::

Examples of different connection behaviours. The connection behaviour can be set using the `fBehavior` input. Valid values are: `fixed`, `fixed_center` and `floating` from [EFConnectionBehaviour](e-f-connection-behaviour) enum.
::: ng-component <connection-behaviour></connection-behaviour>
[component.html] <<< src/demo/app/simple-flow/simple-flow.component.html
[component.ts] <<< src/demo/app/simple-flow/simple-flow.component.ts
[component.scss] <<< src/demo/app/simple-flow/simple-flow.component.scss
:::

Examples of providing custom connection types. The connection type can be set using an array of providers.
::: ng-component <provide-connection-type></provide-connection-type>
[component.html] <<< src/demo/app/simple-flow/simple-flow.component.html
[component.ts] <<< src/demo/app/simple-flow/simple-flow.component.ts
[component.scss] <<< src/demo/app/simple-flow/simple-flow.component.scss
:::
