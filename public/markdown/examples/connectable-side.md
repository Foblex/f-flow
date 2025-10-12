# Connectable Side

## Description

This example demonstrates how to control which side of a connector can be used for connections.
Each connector can have a connectable side — **LEFT**, **RIGHT**, **TOP**, or **BOTTOM**, or you can let the system automatically determine the most appropriate side (**CALCULATE**).

It’s important to note that a connector can have only one active side at a time.
This means that if there are multiple incoming or outgoing connections, they will all enter or leave from the same side of the connector.

The demo highlights two modes:

- **Manual mode** – You can switch the output and input sides of the nodes manually. This allows you to see how connections are drawn when sides are fixed.
- **Calculated mode** – The side is set to **CALCULATE**, meaning it is determined dynamically based on the relative positions of connected nodes.

Additionally, the library also defines connection sides.
If a connection side is specified, it takes precedence over the connector’s side.
You can find more details about connection sides [here](./examples/connection-connectable-side)

This approach gives you fine-grained control over connection behavior while still supporting automatic side calculation for dynamic layouts.

## Example

::: ng-component <connectable-side></connectable-side> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
