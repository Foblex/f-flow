---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Adding a Node from the Palette

## Description

This guide shows how to add [fNode](./docs/f-node-directive) to the [f-canvas](./docs/f-canvas-component) using the [fExternalItem](./docs/f-external-item-directive) directive. The directive allows placing elements outside the canvas and moving them onto it while preserving metadata through `fData`.

This pattern is useful in real workflow builders where users pick a node type from a sidebar or command palette, then drop it onto the canvas to create a new graph element.

## Example

::: ng-component <add-node-from-palette></add-node-from-palette> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/add-node-from-palette/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/add-node-from-palette/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/add-node-from-palette/example.scss
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
