---
toc: false
wideContent: true
summary: "Make Angular diagram nodes resizable with dedicated resize handles."
primaryKeyword: "angular resize handle example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Resize Handle

## Description

This example shows how to make nodes resizable by adding a dedicated resize handle. Resizable nodes are useful when a node needs to reveal more content, adapt to user-defined layout, or behave more like a canvas object than a fixed card.

That interaction matters in editors where nodes can represent notes, groups, configurable panels, or content blocks with variable density. Fixed dimensions are fine for simple demos, but real graph products often need nodes that can grow with the task.

The value here is not only visual flexibility. Resizing changes how users organize information on the canvas.

## Example

::: ng-component <resize-handle></resize-handle> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/resize-handle/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/resize-handle/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/resize-handle/example.scss
:::

## When to use it

- Let users expand nodes to fit richer content.
- Support note-like, panel-like, or group-like nodes.
- Give graph layouts more flexibility without rebuilding node types.

This is a practical example for building editors that feel closer to real design or workflow tools.

## Related docs

- [Resize Handle Directive](./docs/f-resize-handle-directive)
- [Node Directive](./docs/f-node-directive)
- [Rotate Handle Example](./examples/rotate-handle)
- [Magnetic Rects Example](./examples/magnetic-rects)
