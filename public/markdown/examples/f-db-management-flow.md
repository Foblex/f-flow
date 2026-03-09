---
toc: false
wideContent: true
summary: "Database-oriented workflow example with CRUD-style interactions."
primaryKeyword: "angular database workflow example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# DB Management

## Example

This example shows how to build a database-oriented workflow surface with Foblex Flow. It combines nodes, connections, forms, context menus, and CRUD-style editing patterns into a richer editor that feels closer to a production back-office tool than a minimal diagram demo.

::: ng-component <db-management-flow></db-management-flow> [height]="600"
:::

## Possibilities

- Connect nodes using the [f-connection-for-create](./docs/f-connection-for-create-component) component.
- Reassign connections and use snap behavior.
- Move nodes and pan the canvas.
- Zoom with the [fZoom](./docs/f-zoom-directive) directive.
- Add a background, alignment helpers, multi-select, and a [minimap](./docs/f-minimap-component).
- Combine the graph with Angular Material context menus, inputs, selects, and form validation.
- Create, update, and delete nodes and connections.

## When to use it

This example is useful when you need proof that Foblex Flow can sit inside a broader CRUD-oriented Angular screen instead of living as an isolated canvas.

## Source Code

The source code for this example can be found in the [GitHub repository](https://github.com/Foblex/f-flow/tree/main/projects/f-pro-examples).
