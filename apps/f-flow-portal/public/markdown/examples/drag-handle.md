---
toc: false
wideContent: true
---

# Drag Handle

## Description

Attach a dedicated drag area inside a node instead of making the whole node draggable. Use this when your nodes contain buttons, inputs, or rich content and drag should start only from a specific handle.

## Example

::: ng-component <drag-handle></drag-handle> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/drag-handle/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/drag-handle/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/drag-handle/example.scss
:::

## What this pattern enables

- Make only part of the node draggable.
- Protect buttons, images, forms, or other interactive content inside the node.
- Build node UIs that feel closer to real product surfaces instead of generic diagram blocks.

## Position updates

Use `fNodePositionChange` to persist the new `{ x, y }` of a single node after movement.

Use `fMoveNodes` from `<f-flow>` when you need the full batch of moved nodes for:

- group drag handling,
- undo/redo,
- snapping, alignment, or other external layout logic.
