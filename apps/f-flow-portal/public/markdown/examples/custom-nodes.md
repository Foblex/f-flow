---
toc: false
wideContent: true
summary: "Build branded Angular nodes with custom templates and controls."
primaryKeyword: "angular custom node example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Custom Nodes

## Description

This guide shows how to create custom nodes for flow components with different content, styles, and behaviors. You can render any Angular UI inside a node: forms, buttons, metrics, menus, or domain-specific panels.

In practice, custom nodes are one of the biggest reasons teams adopt Foblex Flow instead of a generic diagram widget. Your node can look like a real product component while still participating in drag, selection, and connection logic.

## Example

::: ng-component <custom-nodes></custom-nodes> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/custom-nodes/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/custom-nodes/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/custom-nodes/example.scss
:::

This example uses [Angular Material](https://material.angular.io/) components to fill the custom nodes with content.

## What this solves

- Build branded nodes instead of plain boxes.
- Mix graph interactions with real Angular UI.
- Reuse the same editor primitives across workflow, AI, CRM, or internal-tool use cases.

## When to use it

Start from this example whenever the visual identity of a node matters as much as the graph behavior around it.

## Related docs

- [Node Directive](./docs/f-node-directive)
- [Drag Handle](./docs/f-drag-handle-directive)
- [Angular Node Editor Library](./docs/angular-node-editor-library)
