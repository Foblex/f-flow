# Grid System

## Description

This guide demonstrates how to position nodes in a grid system using Foblex Flow for Angular. To enable the grid system, you need to parameterize the [fDraggable](./docs/f-draggable-directive) directive with the grid properties `[vCellSize]` and `[hCellSize]`.

- `[vCellSize]`: Defines the vertical size of each grid cell.
- `[hCellSize]`: Defines the horizontal size of each grid cell.

## Example

::: ng-component <grid-system></grid-system> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/grid-system/grid-system.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/grid-system/grid-system.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/grid-system/grid-system.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::




