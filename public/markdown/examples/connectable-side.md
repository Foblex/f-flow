---
toc: false
wideContent: true
---

# Connectable Side

## Description

Control which side of a connector accepts or emits connections so routing stays cleaner around each node. Use this when a connector should have one active side at a time, with optional automatic calculation for dynamic layouts.

## Example

::: ng-component <connectable-side></connectable-side> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.scss
:::

## Modes in this demo

- **Manual mode** for fixed connector sides such as `LEFT`, `RIGHT`, `TOP`, or `BOTTOM`.
- **Calculated mode** with `CALCULATE` when the best side should depend on relative node positions.

Each connector still has only one active side at a time, so multiple edges will share that side.

## Related behavior

If a connection-side rule is also specified, it takes precedence over the connector-side rule. See the [Connection Connectable Side](./examples/connection-connectable-side) example for the stronger per-edge override.
