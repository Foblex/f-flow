# Output

**Selector:** [fNodeOutput]

The **FNodeOutputDirective** is a directive that marks an element as an output within a [fNode](f-node-directive). It manages the output-related behaviors, such as connection status and disabled state.

## Inputs

  - `fOutputId: InputSignal<string>;` The unique identifier for the directive instance. Automatically generated. Default: `f-node-output-${uniqueId++}`

  - `fOutputMultiple: InputSignal<boolean>;` Controls how many connections can originate from this **output connector** when using the library’s built‑in **create or reassign connection** features. Default: `false`

  - `fOutputDisabled: InputSignal<boolean>;` Indicates whether the output is disabled. A disabled output may have a different visual representation and interaction behaviour. Default: `false`

  - `fOutputConnectableSide: InputSignal<EFConnectableSide>;`  Specifies the **direction in which the connection line will leave** this output connector (`fNodeOutput`). This controls how the path is drawn relative to the node: top, right, bottom, left, or automatically. Default: `EFConnectableSide.AUTO`

  - `isSelfConnectable: InputSignal<boolean>;` Indicates whether the output can be connected to inputs within the same node. Default: `true`

## Styles

  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-node-output` Specific class for styling the node output element.

  - `.f-node-output-disabled` Applied when the output is disabled.

  - `.f-node-output-multiple` Applied when the output allows multiple connections.

  - `.f-node-output-not-connectable` Applied when the output is not connectable.

  - `.f-node-output-connected` Applied when the output is connected, indicating an active connection.

  - `.f-node-output-self-connectable` Applied when the output can be connected to inputs within the same node.

## Usage

#### Node with Output

This code snippet shows a basic example of a node with an output element. This output can be connected to an input.

```html
<f-flow>
  <f-canvas>
    <div fNode>
      |:|<div fNodeOutput></div>|:|
    </div>
  </f-canvas>
</f-flow>
```

#### Node with Disabled Output

This code snippet shows how to disable an output element.

```html
<f-flow>
  <f-canvas>
    <div fNode>
      <div fNodeOutput |:|[fOutputDisabled]="true"|:|></div>
    </div>
  </f-canvas>
</f-flow>
```

#### Specify connectable side

This code snippet shows how to specify the side of the output that can be connected to. Valid values are top, right, bottom, left, and auto from [EFConnectableSide](e-f-connectable-side) enum.

```html
<f-flow>
  <f-canvas>
    <div fNode>
      <div fNodeOutput |:|[fOutputConnectableSide]="left"|:|></div>
    </div>
  </f-canvas>
</f-flow>
```

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
