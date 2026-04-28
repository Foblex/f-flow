---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Create Node on Connection Drop

## Description

This example shows how to create a node when a dragged connection is dropped into empty space. Instead of failing the gesture or forcing the user to open a separate add-node flow first, the editor can turn that unfinished connection into a new step.

This interaction is a strong fit for workflow builders, AI orchestration tools, and internal low-code products because it keeps graph editing fast and sequential. Users can think in terms of "connect to the next step" and create that step only when they need it.

It is one of the patterns that makes a node editor feel product-like rather than demo-like.

## Example

::: ng-component <create-node-on-connection-drop></create-node-on-connection-drop> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/create-node-on-connection-drop/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/create-node-on-connection-drop/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/create-node-on-connection-drop/example.scss
:::

## When to use it

- Create follow-up steps during connection creation.
- Reduce friction in palette-heavy or menu-heavy editors.
- Speed up exploratory graph building for new users.

This example focuses on drop handling, node creation, and keeping the edge creation flow intuitive.

## Related docs

- [Connection For Create Component](./docs/f-connection-for-create-component)
- [Node Directive](./docs/f-node-directive)
- [Event System](./docs/event-system)
- [Add Node from Palette](./examples/add-node-from-palette)
