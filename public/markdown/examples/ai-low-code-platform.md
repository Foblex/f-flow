---
toc: false
wideContent: true
summary: "Flagship front-end-only AI low-code IDE demo showing most Foblex Flow capabilities plus themes, JSON import/export, config panels, validation, and persistence."
primaryKeyword: "angular workflow builder example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-09"
---

# AI Low-Code Platform

## Example

This example demonstrates how to use Foblex Flow to build a **front-end-only AI low-code IDE demo** in Angular. It is the flagship example in this portal because it combines almost every major capability in the library with a more product-like application shell around the canvas.

It is not just a visual workflow builder. The demo combines a node editor with product-level features: a palette, editable nodes, right-side configuration panels, validation rules, validation feedback reflected back onto the nodes, undo/redo, JSON import/export, runtime theme switching, local persistence, multi-selection, animated connections, and Angular Material UI around the flow surface.

::: ng-component <ai-low-code-platform></ai-low-code-platform> [height]="600"
:::

[Live demo](https://foblex.github.io/Building-AI-Low-Code-Platform5)  
[Source code](https://github.com/Foblex/Building-AI-Low-Code-Platform5)

## Product features

- Use a flagship reference that combines most Foblex Flow capabilities in one Angular app.
- Add nodes from a palette and assemble flows visually.
- Edit node settings through right-side configuration panels with validation.
- Reflect validation state from the panel back onto the node itself.
- Use undo/redo as the baseline safety net while editing.
- Import and export flows as JSON.
- Switch between multiple themes at runtime.
- Persist state and settings in `localStorage`.
- Use animated connections to make data flow easier to read.
- Select multiple items for batch operations.

## Implementation highlights

- Add nodes from the palette to the canvas using the [fExternalItem](./docs/f-external-item-directive) directive.
- Connect nodes using the [f-connection-for-create](./docs/f-connection-for-create-component) component.
- Reassign connections, move nodes, and pan the canvas.
- Zoom with the `mouse wheel`, `double click`, and buttons using the [fZoom](./docs/f-zoom-directive) directive.
- Set the background using the [f-background](./docs/f-background-component) component.
- Use alignment helpers and a [minimap](./docs/f-minimap-component).
- Select multiple items with the [selection area](./docs/f-selection-area-component).

## When to use it

Start from this example if you are evaluating Foblex Flow as the foundation for an AI workflow IDE, internal automation tool, visual logic editor, or any Angular node-based product where the canvas has to work together with forms, validation, persistence, and richer application UI.
