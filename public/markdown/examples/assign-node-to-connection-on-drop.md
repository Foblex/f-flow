---
toc: false
wideContent: true
summary: "Insert a node into an existing edge by dropping it directly onto the connection."
primaryKeyword: "angular assign node to connection example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Assign Node to Connection on Drop

## Description

This example shows how to drop a node onto an existing connection and insert that node into the graph. Instead of forcing users to delete an edge and reconnect everything by hand, the editor treats the connection itself as a valid drop target.

That pattern is useful in workflow builders, AI pipeline editors, ETL tools, and internal low-code products where users frequently add a new step between two already connected nodes.

The important part is not just the visual effect. A good implementation updates the graph structure, preserves a predictable drag-and-drop flow, and makes "insert between steps" feel like a first-class action.

## Example

::: ng-component <assign-node-to-connection-on-drop></assign-node-to-connection-on-drop> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/assign-node-to-connection-on-drop/assign-node-to-connection-on-drop.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/assign-node-to-connection-on-drop/assign-node-to-connection-on-drop.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/assign-node-to-connection-on-drop/assign-node-to-connection-on-drop.component.scss
:::

## When to use it

- Insert approval, transform, or retry steps into an existing chain.
- Let users enrich a workflow without rebuilding the entire edge path.
- Support palette-driven editing in denser diagrams.

This example focuses on edge hit-testing during drop, connection reassignment, and a smoother editing UX for real node-based interfaces.

## Related docs

- [Connection Component](./docs/f-connection-component)
- [Drag and Drop](./docs/f-draggable-directive)
- [Event System](./docs/event-system)
- [Create Node on Connection Drop](./examples/create-node-on-connection-drop)
