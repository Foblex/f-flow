---
toc: false
wideContent: true
summary: "Render multiple independent or synchronized flow canvases on the same Angular page."
primaryKeyword: "angular multiple flows on same page example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Multiple Flows on Same Page

## Description

This example demonstrates how to place multiple flow canvases on the same Angular page. Each flow can work independently, or several views can reflect the same underlying data model with different presentation or interaction goals.

This pattern is useful when one screen needs a main editor plus a secondary graph view, a compact embedded builder next to a detailed canvas, or separate flows that belong to the same business process. It is also relevant for dashboard-style products where several node-based interfaces live side by side.

The key value is architectural: the example shows that Foblex Flow can support more than a single full-screen canvas.

## Example

::: ng-component <multiple-flows-on-same-page></multiple-flows-on-same-page> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/multiple-flows-on-same-page/multiple-flows-on-same-page.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/multiple-flows-on-same-page/multiple-flows-on-same-page.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/multiple-flows-on-same-page/multiple-flows-on-same-page.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## What this solves

- Host multiple independent graph editors in one page.
- Show different views over related graph data.
- Build richer Angular layouts without forcing a one-canvas app structure.

Use this when your product needs graph editing as one part of a larger page, not the whole page itself.

## Related docs

- [Flow Component](./docs/f-flow-component)
- [Canvas Component](./docs/f-canvas-component)
- [Minimap Example](./examples/minimap)
- [AI Low-Code Platform Example](./examples/ai-low-code-platform)
