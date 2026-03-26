---
toc: false
wideContent: true
---

# Grid System

## Description

This guide demonstrates how to position nodes in a grid system using Foblex Flow for Angular. To enable the grid system, parameterize the [fDraggable](./docs/f-draggable-directive) directive with the grid properties `[vCellSize]` and `[hCellSize]`.

- `[vCellSize]`: Defines the vertical size of each grid cell.
- `[hCellSize]`: Defines the horizontal size of each grid cell.

Grid snapping is useful when your editor should feel structured instead of fully freeform, especially for dashboards, internal tools, and business workflow builders where consistency matters.

It is also a practical way to reduce accidental misalignment when users place many nodes manually.
The result is a cleaner layout with less effort from the user.
In many internal tools, that consistency makes screenshots, reviews, and shared diagrams much easier to understand.
It is a simple constraint, but it can noticeably improve perceived quality.

## Example

::: ng-component <grid-system></grid-system> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/grid-system/grid-system.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/grid-system/grid-system.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/grid-system/grid-system.component.scss
:::

## Related docs

- [Drag and Drop](./docs/f-draggable-directive)
- [Magnetic Lines Example](./examples/magnetic-lines)
