---
toc: false
wideContent: true
summary: "Rotate Angular diagram nodes with a dedicated handle and controlled interaction."
primaryKeyword: "angular rotate handle example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Rotate Handle

## Description

This example shows how to rotate nodes with a dedicated handle. Rotation is useful when node orientation carries meaning or when users need more freedom arranging the canvas than a rigid top-to-bottom layout allows.

It can be helpful in design-like interfaces, architecture diagrams, and specialized editors where arrows, assets, or blocks should face a certain direction. Even when used sparingly, rotation makes the canvas feel more flexible and more tool-like.

The important part is keeping the interaction understandable. A rotate handle gives users a clear affordance instead of hiding orientation changes behind generic drag logic.

## Example

::: ng-component <rotate-handle></rotate-handle> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/rotate-handle/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/rotate-handle/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/rotate-handle/example.scss
:::

## What this solves

- Add explicit orientation control for selected node types.
- Support richer diagram composition and layout experimentation.
- Keep rotation behavior separate from move and resize interactions.

Use this when your editor needs spatial freedom beyond standard flowchart positioning.

## Related docs

- [Rotate Handle Directive](./docs/f-rotate-handle-directive)
- [Node Directive](./docs/f-node-directive)
- [Resize Handle Example](./examples/resize-handle)
- [Drag Handle Example](./examples/drag-handle)
