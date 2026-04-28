---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Drag to Reassign

## Description

This example demonstrates how to reassign existing connections between connectors using drag-and-drop interactions. Reassignment is one of the key differences between a simple diagram and a usable editor: users can change a flow without deleting and rebuilding every edge by hand.

It is especially useful in workflow builders, AI pipeline editors, and logic tools where users iterate on graph structure constantly.

It also makes experimentation faster because users can explore alternatives without breaking the entire graph editing flow.
That matters most in tools where connections change often during real user work.

## Example

::: ng-component <drag-to-reassign></drag-to-reassign> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/drag-to-reassign/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/drag-to-reassign/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/drag-to-reassign/example.scss
:::

## What this solves

- Lets users correct graph wiring quickly.
- Reduces friction compared with delete-and-recreate flows.
- Provides a better editing experience for larger or more exploratory diagrams.

For products with frequent graph editing, reassignment usually improves usability more than adding another visual polish feature.

## Related docs

- [Drag and Drop](./docs/f-draggable-directive)
- [Connection Component](./docs/f-connection-component)
- [Connection Rules](./docs/connection-rules)
