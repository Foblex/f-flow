---
toc: false
wideContent: true
summary: "Automatic directed graph layout with Dagre and Foblex Flow."
primaryKeyword: "angular dagre layout example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Dagre Tree

## Description

This example demonstrates automatic graph layout using [dagre.js](https://github.com/dagrejs/dagre) together with Foblex Flow and Angular. The component builds a tree from a set of nodes and edges, computes positions using `dagre.layout(graph)`, and renders nodes and connections on the flow canvas.

## Example

::: ng-component <dagre-layout></dagre-layout> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/dagre-layout/dagre-layout.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/dagre-layout/dagre-layout.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/dagre-layout/dagre-layout.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## What this example shows

- Switching layout direction: left-to-right and top-to-bottom.
- Optional auto layout behavior, where the flow resets before recalculation.
- Automatic viewport fitting after layout completes.

## Technical details

- The graph is built using `dagre.graphlib.Graph`.
- Nodes come from `GRAPH_DATA`, while edges are derived from `parentId`.
- After layout, coordinates are mapped back into your Angular node state.

## When to use it

Use Dagre when your diagram has a mostly hierarchical structure and you want a predictable directed layout for org charts, dependency graphs, or workflow trees.

## Related docs and examples

- [Angular Diagram Library](./docs/angular-diagram-library)
- [ELKJS Layout Example](./examples/elkjs-layout)
- [Flow Docs](./docs/f-flow-component)
