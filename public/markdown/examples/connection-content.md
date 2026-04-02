---
toc: false
wideContent: true
summary: "Attach labels, actions, and status widgets directly to connections."
primaryKeyword: "angular connection content example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Connection Content

## Description

The `fConnectionContent` directive lets you attach any custom content to a connection line: text, icons, buttons, or widgets. The element can be positioned along the path, shifted perpendicularly, and optionally rotated to follow the connection.

This is useful for adding labels, statuses, metrics, or interactive controls directly on diagram edges. In real products, it is one of the features that turns a passive edge into a meaningful UI element.

`fConnectionContent` is rendered as a regular HTML block with the `.f-connection-content` class, so it should be styled directly as HTML content rather than as part of the SVG path. The base component gives it intrinsic width sizing, so by default it expands to its content.

## Example

::: ng-component <connection-content></connection-content> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-content/connection-content.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-content/connection-content.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-content/connection-content.scss
:::

## API

- **position: number (0..1)** positions the content along the connection.
- **offset: number** shifts it perpendicularly in pixels.
- **align: 'none' | 'along'** controls whether the content rotates with the path.

## When to use it

- Add labels or states to workflow transitions.
- Show metrics or diagnostics on graph edges.
- Place buttons directly on connections for quick actions.
- Build richer diagram semantics without an extra overlay layer.

It is especially helpful when edge semantics are important and the user should not have to inspect a side panel to understand the state of a transition.
