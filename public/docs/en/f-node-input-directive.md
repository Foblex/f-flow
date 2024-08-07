﻿# Input

**Selector:** [fNodeInput]

The **FNodeOutputDirective** is a directive that marks an element as an input within a [fNode](f-node-directive). It manages input-specific behaviours, such as allowing multiple connections, handling disabled state, and determining connectability.

## Inputs

  - `fInputId: string;` The unique identifier for the directive instance. Automatically generated. Default: `f-node-input-${uniqueId++}`

  - `fInputDisabled: boolean;` Indicates whether the input is disabled. A disabled input may have a different visual representation and interaction behavior. Default: `false`

  - `fInputMultiple: boolean;`  Determines whether the input allows multiple connectionsDefault: `Default: true`

  - `fOutputConnectableSide: EFConnectableSide;` Indicates the side of the output where the connection can be created. Accepts a value from [EFConnectableSide](e-f-connectable-side) enum. Default: `EFConnectableSide.AUTO`

## Outputs

 - `isConnected: boolean;` Indicates whether the input is connected.

## Methods

 - `refresh(): void;` Refreshes the state of the node, typically triggering a re-render or update.

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

Example of how to use the [fOutputConnectableSide](f-output-connectable-side) and [fInputConnectableSide](f-input-connectable-side) directives to specify the side of the node that can be connected to. Valid values are top, right, bottom, left, and auto from [EFConnectableSide](e-f-connectable-side) enum.
::: ng-component <connectable-side></connectable-side>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectable-side/connectable-side.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectable-side/connectable-side.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectable-side/connectable-side.component.scss
:::
