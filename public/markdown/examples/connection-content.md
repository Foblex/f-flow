# Connection Center

## Description

The fConnectionContent directive lets you attach any custom content to a connection line — text, icons, buttons, or widgets. The element can be positioned along the path, shifted perpendicularly, and optionally rotated to follow the connection. Multiple content elements can be placed on the same connection.

This is useful for adding labels, statuses, metrics, or interactive controls directly on diagram edges.

## API

- **position: number (0..1)** — position along the connection.
  0 = start, 0.5 = middle (default), 1 = end.
- **offset: number** — perpendicular shift from the connection (in pixels).
  Negative values shift left, positive values shift right.
- **align: 'none' | 'along'** — orientation of the content.
  - none — no rotation (default).
  - along — rotated along the path (tangent).

## Example

::: ng-component <connection-content></connection-content> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-content/connection-content.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-content/connection-content.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-content/connection-content.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
