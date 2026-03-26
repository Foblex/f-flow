---
toc: false
wideContent: true
summary: "Drag new node types from a palette into the flow canvas."
primaryKeyword: "angular node palette example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Adding a Node from the Palette

## Description

This guide shows how to add [fNode](./docs/f-node-directive) to the [f-canvas](./docs/f-canvas-component) using the [fExternalItem](./docs/f-external-item-directive) directive. The directive allows placing elements outside the canvas and moving them onto it while preserving metadata through `fData`.

This pattern is useful in real workflow builders where users pick a node type from a sidebar or command palette, then drop it onto the canvas to create a new graph element.

## Example

::: ng-component <add-node-from-palette></add-node-from-palette> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component.scss
:::

## What this solves

- Build a node toolbox without coupling the palette to node rendering.
- Keep node creation explicit and easy to understand.
- Add previews and placeholders during drag operations.

#### Directive Features

- **fExternalItem** links an element to the canvas so it can create nodes on drop.
- **fPlaceholder** and **fPreview** let you render dedicated drag states.
- **fPreviewMatchSize** keeps the preview aligned with the original palette item.

## Related docs

- [External Item](./docs/f-external-item-directive)
- [Flow](./docs/f-flow-component)
- [AI Low-Code Platform Example](./examples/ai-low-code-platform)
