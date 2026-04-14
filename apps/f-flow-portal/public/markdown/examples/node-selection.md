---
toc: false
wideContent: true
summary: "Select single and multiple nodes with clicks and keyboard modifiers in Angular."
primaryKeyword: "angular node selection example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Node Selection

## Description

This example demonstrates how to select nodes in Foblex Flow for Angular with click-based and keyboard-modified interactions. Users can click to select a single node or hold `CTRL` / `CMD` while clicking to build a multi-selection.

Selection is one of the baseline interactions that separates a usable node editor from a static diagram. As soon as users need to move, inspect, delete, duplicate, or group several nodes, predictable selection behavior becomes essential.

Even if your product later adds box selection, grouping, or bulk actions, click selection remains the first layer of that interaction model.

## Example

::: ng-component <node-selection></node-selection> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/node-selection/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/node-selection/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/node-selection/example.scss
:::

## When to use it

- Support single-select and additive multi-select flows.
- Prepare nodes for batch actions, grouping, or deletion.
- Keep keyboard-and-mouse editing predictable in larger diagrams.

This page is a good entry point for building a fuller selection system before you add box selection or history support.

## Related docs

- [Selection System](./docs/selection-system)
- [Selection Area Component](./docs/f-selection-area-component)
- [Selection Area Example](./examples/selection-area)
- [Undo/Redo Example](./examples/undo-redo)
