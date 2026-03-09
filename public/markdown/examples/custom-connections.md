---
toc: false
wideContent: true
summary: "Build fully custom Angular connections with your own drawing, routing, and interaction logic."
primaryKeyword: "angular custom connections example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Custom Connections

## Description

This example goes beyond a single custom connection type and shows how to build fully custom connections with your own rendering, routing, and interactive behavior. It is the right pattern when edges are a meaningful part of the product instead of a generic line between two nodes.

In advanced editors, connections can carry labels, validation state, routing rules, or domain-specific affordances. Once that happens, default edge presets often become too limited.

This page is useful for teams building graph products where connections are part of the user workflow, not just supporting visuals.

## Example

::: ng-component <custom-connections></custom-connections> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-connections/custom-connections.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-connections/custom-connections.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-connections/custom-connections.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## When to use it

- Build domain-specific edges with custom visuals and logic.
- Add richer routing or interaction than built-in presets allow.
- Create graph interfaces where edge behavior is part of the product model.

If your editor needs custom edge drawing plus custom interaction, this example is the stronger starting point than simple styling changes.

## Related docs

- [Connection Component](./docs/f-connection-component)
- [Connection Waypoints Component](./docs/f-connection-waypoints-component)
- [Custom Connection Type Example](./examples/custom-connection-type)
- [Connection Content Example](./examples/connection-content)
