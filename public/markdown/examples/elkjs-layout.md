---
toc: false
wideContent: true
summary: "Use ELKJS to compute richer automatic layouts for graph UIs."
primaryKeyword: "angular elkjs layout example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# ELKJS Tree

## Description

This example shows how to use [ELKJS](https://github.com/kieler/elkjs) with Foblex Flow and Angular to generate automatic graph layouts. ELKJS is useful when you need more layout flexibility than a basic tree arrangement and want to experiment with layered or more advanced graph placement strategies.

Foblex Flow remains responsible for rendering and interaction. ELKJS calculates positions; your Angular app decides when to run layout and how to merge the results back into graph state.

That split keeps layout logic replaceable while preserving the same editor surface and interaction model.

## Example

::: ng-component <elkjs-layout-example></elkjs-layout-example> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/elkjs-layout-example/elkjs-layout-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/elkjs-layout-example/elkjs-layout-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/elkjs-layout-example/elkjs-layout-example.component.scss
:::

## When to use it

- Generate automatic layouts for complex or dense graphs.
- Recompute node placement after data changes.
- Compare freeform editing with layout-assisted views.

If layout quality matters more than minimal configuration, ELKJS is usually the better starting point than a simpler tree-only approach.

## Related docs and examples

- [Dagre Layout Example](./examples/dagre-layout)
- [Zoom Docs](./docs/f-zoom-directive)
- [Angular Node-Based UI Library](./docs/angular-node-based-ui-library)
