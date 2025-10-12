# Connection Connectable Side

## Description

This example demonstrates how to control which side of a connection (both at its start and end) is used when linking nodes.
Each connection can have a specific side assigned — **LEFT**, **RIGHT**, **TOP**, or **BOTTOM** — or you can let the system determine the most appropriate side automatically using **CALCULATE**, **CALCULATE_HORIZONTAL**, or **CALCULATE_VERTICAL**.

You can define the connectable side for both the output (source) and input (target) of a connection.
This gives you precise control over how connections are drawn between nodes, independent of the connector sides themselves.

The available enum values are defined as:

```typescript
export enum EFConnectionConnectableSide {
  DEFAULT = 'default',
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  CALCULATE = 'calculate',
  CALCULATE_HORIZONTAL = 'calculate_horizontal',
  CALCULATE_VERTICAL = 'calculate_vertical',
}
```

The demo showcases how different connection sides affect the visual layout:

- **Manual mode** – You can manually switch the output and input sides of each connection to see how the connection path changes when sides are fixed.
- **Calculated mode** – Uses one of the **CALCULATE** options to dynamically determine the best sides based on the positions of connected nodes.

Unlike connector sides (which define how connections attach to a specific node), connection sides take precedence if both are set.
This allows you to override connector behavior for finer visual and logical control over connection routing.

This flexibility enables consistent, predictable connection drawing while still supporting dynamic and adaptive layouts.

## Example

::: ng-component <connection-connectable-side></connection-connectable-side> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-connectable-side/connection-connectable-side.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-connectable-side/connection-connectable-side.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-connectable-side/connection-connectable-side.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
