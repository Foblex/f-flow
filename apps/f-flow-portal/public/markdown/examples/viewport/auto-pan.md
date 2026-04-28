---
toc: false
wideContent: true
publishedAt: "2026-03-26"
updatedAt: "2026-03-26"
---

# Auto Pan

## Description

This example shows how to keep drag interactions moving when the pointer reaches the edge of `f-flow`. Instead of forcing users to drop, pan manually, and start over, the viewport continues to scroll while the drag session stays active.

The demo enables auto-pan through `<f-auto-pan />` and combines the supported drag kinds in one place: connection creation, connection reassignment, node dragging, and selection area.

## Example

::: ng-component <auto-pan></auto-pan> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/auto-pan/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/auto-pan/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/auto-pan/example.scss
:::

## What to try

- Drag the source node connector toward the off-screen input.
- Reassign the existing connection to the far target.
- Drag the lower node and keep the pointer near the right edge.
- Hold `Shift` and extend the selection rectangle until it reaches the off-screen node.
- Toggle `<f-auto-pan />` on and off with the checkbox in the toolbar.
- Adjust `fEdgeThreshold`, `fSpeed`, and `fAcceleration` in the toolbar.

## Related docs

- [Auto Pan](./docs/f-auto-pan-component)
- [Drag and Drop](./docs/f-draggable-directive)
- [Selection Area](./docs/f-selection-area-component)
