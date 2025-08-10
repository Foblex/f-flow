# Input

**Selector:** [fNodeInput]

The **FNodeOutputDirective** is a directive that marks an element as an input within a [fNode](f-node-directive). It manages input-specific behaviours, such as allowing multiple connections, handling disabled state, and determining connectability.

## Inputs

  - `fInputId: InputSignal<string>;` The unique identifier for the directive instance. Automatically generated. Default: `f-node-input-${uniqueId++}`

  - `fInputMultiple: InputSignal<boolean>` Controls how many connections can be attached to this input connector when using the library’s create or reassign connection features. When true, the input can accept multiple simultaneous incoming connections. When false, the built-in logic will only allow one connection at a time — attempting to add another will either replace or block the existing one, depending on the configured behavior. Default: `true`

  - `fInputDisabled: InputSignal<boolean>` When true, the input connector is disabled: it cannot accept new incoming connections and is treated as a non-interactive drop target. The UI may render it in a disabled style to reflect its state. Default: `false`

  - `fInputConnectableSide: InputSignal<EFConnectableSide>;` Defines from which side a connection line will enter the input connector (fNodeInput) within a node. This setting controls the exact point on the connector where the connection line attaches, not the node as a whole. Default: `EFConnectableSide.AUTO`

## Styles

  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-node-input` Specific class for styling the node input element.

  - `.f-node-input-disabled` Applied when the input is disabled.

  - `.f-node-input-multiple` Applied when the input allows multiple connections.

  - `.f-node-input-not-connectable` Applied when the input is not connectable.

  - `.f-node-input-connected` Applied when the input is connected, indicating an active connection.

## Usage

```html
<f-flow>
  <f-canvas>
    <div fNode>
      |:|<div fNodeInput></div>|:|
    </div>
  </f-canvas>
</f-flow>
```

You can also add **fNodeInput** directive to the element containing the [fNode](f-node-directive) directive
```html
<f-flow>
  <f-canvas>
    |:|<div fNode fNodeInput></div>|:|
  </f-canvas>
</f-flow>
```

::: info INFO
The [f-connection](f-connection-component) component takes the border-radius of the component into account when connecting
:::

## Examples

#### Node with connectors

This example shows how to use the [fNodeOutput](f-node-output-directive) directive to create a node with an output element that can be connected to an input.

::: ng-component <node-with-connectors></node-with-connectors>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node-with-connectors/node-with-connectors.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node-with-connectors/node-with-connectors.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node-with-connectors/node-with-connectors.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

#### Different Connectable Side

Example of how to use the [fOutputConnectableSide](f-node-output-directive) and [fInputConnectableSide](f-node-input-directive) directives to specify the side of the node that can be connected to. Valid values are top, right, bottom, left, and auto from [EFConnectableSide](e-f-connectable-side) enum.
::: ng-component <connectable-side></connectable-side>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connectable-side/connectable-side.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connectable-side/connectable-side.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connectable-side/connectable-side.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::
