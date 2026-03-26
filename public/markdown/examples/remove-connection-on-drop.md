---
toc: false
wideContent: true
summary: "Remove an existing connection by dragging and dropping it onto an invalid or removal target."
primaryKeyword: "angular remove connection on drop example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Remove Connection on Drop

## Description

This example shows how to remove a connection as part of a drag-and-drop interaction. Instead of forcing users to open a context menu or click a separate delete control, the editor can treat a drop on an invalid area or removal target as a delete action for that edge.

That pattern is useful in workflow builders and graph UIs where users edit connections frequently. It keeps edge cleanup fast and makes graph editing feel more direct.

The key is clear feedback: users should understand when they are reassigning a connection, when they are canceling a drag, and when they are actually deleting an edge.

## Example

::: ng-component <remove-connection-on-drop></remove-connection-on-drop> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/remove-connection-on-drop/remove-connection-on-drop.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/remove-connection-on-drop/remove-connection-on-drop.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/remove-connection-on-drop/remove-connection-on-drop.component.scss
:::

## What this solves

- Faster edge cleanup for iterative graph editing.
- A clearer deletion flow for connection-heavy interfaces.
- Better UX when users frequently rewire or simplify diagrams.

This example is a practical companion to edge creation and reassignment patterns.

## Related docs

- [Connection Component](./docs/f-connection-component)
- [Event System](./docs/event-system)
- [Drag to Reassign Example](./examples/drag-to-reassign)
- [Create Node on Connection Drop](./examples/create-node-on-connection-drop)
