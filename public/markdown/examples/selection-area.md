---
toc: false
wideContent: true
summary: "Use a rubber-band selection box for multi-select workflows."
primaryKeyword: "angular multi select diagram example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Selection Area

## Description

This guide shows how to add a [selection area](./docs/f-selection-area-component) to the canvas. Use the `Shift` key and the mouse to select multiple nodes with a rectangle, which is a baseline interaction for larger node editors and workflow tools.

Selection area becomes important as soon as users need to move, delete, group, or inspect several nodes at once. Without it, a graph interface quickly becomes frustrating on dense canvases.

## Example

::: ng-component <selection-area></selection-area> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/selection-area/selection-area.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/selection-area/selection-area.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/selection-area/selection-area.component.scss
:::

## When to use it

- Multi-select nodes before moving or deleting them.
- Prepare groups or batch operations.
- Improve keyboard-and-mouse workflows in larger diagrams.

Once your canvas holds more than a handful of nodes, box selection usually becomes a core interaction instead of an optional enhancement.

It also pairs naturally with grouping, alignment helpers, and undo/redo workflows.

## Related docs

- [Selection Area Docs](./docs/f-selection-area-component)
- [Drag and Drop](./docs/f-draggable-directive)
- [Undo/Redo Example](./examples/undo-redo)
