---
toc: false
wideContent: true
---

# Connection Connectable Side

## Description

Control which side an individual connection uses at both ends instead of relying only on connector defaults. Use this when routing should stay predictable, or when a specific edge needs to override the usual node-side behavior.

## Example

::: ng-component <connection-connectable-side></connection-connectable-side> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-connectable-side/connection-connectable-side.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-connectable-side/connection-connectable-side.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-connectable-side/connection-connectable-side.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## Supported modes

- Set explicit sides such as `LEFT`, `RIGHT`, `TOP`, or `BOTTOM`.
- Use `CALCULATE`, `CALCULATE_HORIZONTAL`, or `CALCULATE_VERTICAL` when the route should adapt to node positions.
- Configure the side independently for the output and input of each connection.

## Why it matters

- Manual mode helps when the route itself carries meaning and should not jump around.
- Calculated modes are useful when layouts are dynamic but still need cleaner edge directions.
- Connection-side settings take precedence over connector-side settings, so they are the stronger routing control.
