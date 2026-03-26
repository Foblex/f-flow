---
toc: false
wideContent: true
summary: "Navigate large canvases with an interactive minimap."
primaryKeyword: "angular minimap example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Minimap

## Description

This guide shows how to create a minimap that displays the entire canvas and lets users navigate the viewport by dragging inside the minimap.

You can set a custom class for each node and group in the minimap using the `fMinimapClass` property. The minimap can be wrapped in any container, but it must remain inside the main flow component.

For complex workflow builders or diagram tools, a minimap is one of the fastest ways to keep orientation on large canvases. It works especially well together with zoom, fit-to-screen controls, and custom viewport shortcuts.

## Example

::: ng-component <minimap-example></minimap-example> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/minimap-example/minimap-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/minimap-example/minimap-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/minimap-example/minimap-example.component.scss
:::

## When to use it

- Your canvas can extend far beyond the viewport.
- Users navigate complex or multi-cluster graphs.
- You want quick “jump to area” navigation in production editors.

It is one of the simplest features to add while delivering an immediate usability improvement for larger diagrams.

## Related docs

- [Minimap Docs](./docs/f-minimap-component)
- [Zoom Docs](./docs/f-zoom-directive)
- [AI Low-Code Platform Example](./examples/ai-low-code-platform)
