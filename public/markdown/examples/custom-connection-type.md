---
toc: false
wideContent: true
summary: "Define a reusable custom connection type with its own rendering and interaction model."
primaryKeyword: "angular custom connection type example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Custom Connection Type

## Description

This example shows how to define a custom connection type instead of relying only on the built-in edge styles. A custom type lets you control path geometry, visual styling, interaction rules, and how a specific class of connection behaves in your editor.

That matters when connections carry meaning. Approval edges, fallback routes, data dependencies, validation paths, or system-to-system links often should not all look and behave the same.

Using a custom connection type is the right step when standard straight, segment, or bezier edges are close, but not quite enough for the product semantics you need.

## Example

::: ng-component <custom-connection-type></custom-connection-type> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-connection-type/custom-connection-type.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-connection-type/custom-connection-type.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-connection-type/custom-connection-type.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## What this solves

- Reusable edge behavior for one specific connection category.
- Better visual distinction between different graph relationships.
- A safer path to domain-specific graph UX without forking the whole editor model.

This example is useful when you want a consistent custom edge type, not just one-off styling tweaks.

## Related docs

- [Connection Component](./docs/f-connection-component)
- [Connection Marker Directive](./docs/f-connection-marker-directive)
- [Connection Types Example](./examples/connection-types)
- [Connection Gradients Example](./examples/connection-gradients)
