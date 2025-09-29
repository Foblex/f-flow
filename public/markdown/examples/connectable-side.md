# Connectable Side

## Description

This example demonstrates how to control which side of a node can be used for connections.
By assigning a connectable side to each connector, you can restrict connections to LEFT, RIGHT, TOP, or BOTTOM, or let the system calculate the most appropriate side automatically.

The demo highlights two modes:

- **Manual mode** – You can switch the output and input sides of the nodes manually. This allows you to see how connections are drawn when sides are fixed.
- **Calculated mode** – The side is set to **CALCULATE**, meaning it is determined dynamically based on the relative positions of connected nodes.

This flexibility gives you precise control over connection behavior, while still supporting automatic side calculation for dynamic layouts.

## Example

::: ng-component <connectable-side></connectable-side> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
