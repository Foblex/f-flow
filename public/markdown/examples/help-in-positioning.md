---
toc: false
wideContent: true
noindex: true
summary: "Legacy node positioning helper example kept for backward reference."
primaryKeyword: "angular legacy positioning helpers example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Help in Positioning (Deprecated)

## Description

This example documents an older approach to positioning helpers in Foblex Flow for Angular. It is kept for reference and backward compatibility, but it is not the recommended starting point for new projects.

For the current and improved UX, use:

- [Magnetic Lines](./examples/magnetic-lines) for snap lines and alignment guides
- [Magnetic Rects](./examples/magnetic-rects) for equal spacing hints and snapping

## Example

::: ng-component <help-in-positioning></help-in-positioning> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/help-in-positioning/help-in-positioning.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/help-in-positioning/help-in-positioning.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/help-in-positioning/help-in-positioning.component.scss
:::

## What this legacy example demonstrates

- Basic help while dragging for aligning nodes
- A minimal setup inside `<f-flow>` using the older implementation

If you are building a modern node editor, prefer Magnetic Lines and Magnetic Rects instead. This legacy page stays `noindex` on purpose because the newer examples are the correct recommendation for search traffic and new implementations.

## Related docs

- [Magnetic Lines Component](./docs/f-magnetic-lines-component)
- [Magnetic Rects Component](./docs/f-magnetic-rects-component)
- [Selection Area Example](./examples/selection-area)
