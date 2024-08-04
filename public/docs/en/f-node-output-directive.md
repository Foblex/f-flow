# Output

**Selector:** [fNodeOutput]

The **FNodeOutputDirective** is a directive that marks an element as an output within a [fNode](f-node-directive). It manages the output-related behaviors, such as connection status and disabled state.

## Inputs

  - `fOutputId: string;` The unique identifier for the directive instance. Automatically generated. Default: `f-node-output-${uniqueId++}`

  - `fOutputDisabled: boolean;` Indicates whether the output is disabled. A disabled output may have a different visual representation and interaction behaviour. Default: `false`

  - `fOutputConnectableSide: EFConnectableSide;`  Indicates the side of the output where the connection can be created. Accepts a value from [EFConnectableSide](e-f-connectable-side) enum. Default: `EFConnectableSide.AUTO`

## Outputs

 - `isConnected: boolean;` Indicates whether the output is connected.

## Methods

 - `refresh(): void;` Refreshes the state of the node, typically triggering a re-render or update.

## Styles

  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-node-output` Specific class for styling the node output element.

  - `.f-node-output-disabled` Applied when the output is disabled.

  - `.f-node-output-connected` Applied when the output is connected, indicating an active connection.

## Usage

```html
<f-flow>
  <f-canvas>
    <div fNode>
      |:|<div fNodeOutput></div>|:|
    </div>
  </f-canvas>
</f-flow>
```

## Examples

Example of how to use the [fOutputConnectableSide](f-output-connectable-side) and [fInputConnectableSide](f-input-connectable-side) directives to specify the side of the node that can be connected to. Valid values are top, right, bottom, left, and auto from [EFConnectableSide](e-f-connectable-side) enum.
::: ng-component <connectable-side></connectable-side>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectable-side/connectable-side.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectable-side/connectable-side.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectable-side/connectable-side.component.scss
:::
