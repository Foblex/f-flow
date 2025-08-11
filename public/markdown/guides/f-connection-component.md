# Connection

**Selector:** f-connection

The **FConnectionComponent** is a component that represents a connection between nodes in a flow. It allows customization of the connection's appearance and behaviour, including color, type, and interactivity.  

## Inputs

  - `fConnectionId: InputSignal<string>;` The unique identifier for the component instance. Automatically generated. Default: `f-connection-${uniqueId++}`

  - `fReassignDisabled: InputSignal<boolean>;` Indicates whether the connection cannot be reassigned. Default: `false`.

  - `fSelectionDisabled: InputSignal<boolean>;` Indicates whether the connection cannot be selected. Default: `false`.

  - `fStartColor: InputSignal<string>;` Sets the color at the start of the connection line. Combined with fEndColor, this produces a gradient from start to end. Default: `black`.

  - `fEndColor: InputSignal<string>;` Sets the color at the end of the connection line. Use this together with fStartColor to create a two-stop gradient along the connection. Default: `black`.

  - `fOutputId: InputSignal<string>;` The identifier of the [FNodeOutputDirective](f-node-output-directive) where the connection starts.

  - `fInputId: InputSignal<string>;` The identifier of the [FNodeInputDirective](f-node-input-directive) where the connection ends.

  - `fBehavior: InputSignal<EFConnectionBehavior>;` The behaviour of the connection, affecting its positioning and flexibility. Accepts a value from [EFConnectionBehavior]() enum. Default: `EFConnectionBehavior.FIXED`

  - `fType: InputSignal<EFConnectionType | string>;` The visual type of the connection, such as straight, bezier and etc. Accepts a value from [EFConnectionType]() enum or string for custom connection. Default: `EFConnectionType.STRAIGHT`

  - `fText: InputSignal<string>;` The text displayed on the connection. Default: `null`

  - `fTextStartOffset: InputSignal<number>;` The offset of the text from the start of the connection. Default: `50%`

  - `fOffset: InputSignal<number>;` Minimum length of the connection before a curve can occur. Default: `12`

  - `fRadius: InputSignal<number>;` Radius used for curves. Default: `8`

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

#### Different Connection Types
Examples of different connection types. The connection type can be set using the `fType` input. Valid values are `straight`, `bezier` and `segment from [EFConnectionType](e-f-connection-type) enum.
::: ng-component <connection-type></connection-type>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-type/connection-type.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-type/connection-type.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-type/connection-type.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

#### Different Connection Behaviours
Examples of different connection behaviours. The connection behaviour can be set using the `fBehavior` input. Valid values are: `fixed`, `fixed_center` and `floating` from [EFConnectionBehaviour](e-f-connection-behaviour) enum.
::: ng-component <connection-behaviour></connection-behaviour>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-behaviour/connection-behaviour.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-behaviour/connection-behaviour.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-behaviour/connection-behaviour.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

#### Custom Connection Type
Examples of providing custom connection types. The connection type can be set using an array of providers.
::: ng-component <custom-connection-type></custom-connection-type>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/custom-connection-type/custom-connection-type.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/custom-connection-type/custom-connection-type.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/custom-connection-type/custom-connection-type.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

#### Reassign Connection
Each connection can be reassigned to another [fNodeInput](f-node-input-directive). The `fReassignDisabled` property can be used to disable this feature. Each connection has a `DragHandle` at the end, drag it to reassign the connection to another [fNodeInput](f-node-input-directive).
::: ng-component <drag-to-reassign></drag-to-reassign> 
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-reassign/drag-to-reassign.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-reassign/drag-to-reassign.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-reassign/drag-to-reassign.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
