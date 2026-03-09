---
toc: false
wideContent: true
summary: "Production-style AI low-code platform example built with Foblex Flow and Angular."
primaryKeyword: "angular workflow builder example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# AI Low-Code Platform

## Example

This example demonstrates how to use Foblex Flow to build an **AI low-code platform interface** in Angular. It is one of the clearest examples of how the library can power a **workflow builder**, **AI pipeline UI**, or any node-based product surface where users assemble logic visually.

The demo focuses on a more realistic editor shape than the smaller examples: a palette, editable nodes, connections, viewport controls, persistence-friendly state, and richer UI around the canvas.

::: ng-component <ai-low-code-platform></ai-low-code-platform> [height]="700"
:::

[Live demo](https://foblex.github.io/Building-AI-Low-Code-Platform5)  
[Source code](https://github.com/Foblex/Building-AI-Low-Code-Platform5)

## Possibilities

- Add nodes from the palette to the canvas using the [fExternalItem](./docs/f-external-item-directive) directive.
- Connect nodes using the [f-connection-for-create](./docs/f-connection-for-create-component) component.
- Reassign connections.
- Move nodes and pan the canvas.
- Zoom with the `mouse wheel`, `double click`, and buttons using the [fZoom](./docs/f-zoom-directive) directive.
- Set the background using the [f-background](./docs/f-background-component) component.
- Use alignment helpers and a [minimap](./docs/f-minimap-component).
- Select multiple items with the [selection area](./docs/f-selection-area-component).

## When to use it

Start from this example if you are evaluating Foblex Flow for AI workflows, internal automation tools, visual logic editors, or any production-style Angular workflow builder.
