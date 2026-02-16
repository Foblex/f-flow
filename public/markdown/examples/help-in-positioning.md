# Help in Positioning (Deprecated)

## Description

⚠️ **Deprecated:** this example shows an older approach to node positioning helpers in **Foblex Flow for Angular**.  
It is kept for reference and backward compatibility, but it is **not recommended** for new projects.

For the current and improved UX, use:

- **[Magnetic Lines](/magnetic-lines)** — snap lines and alignment guides for edges and centers
- **[Magnetic Rects](/magnetic-rects)** — equal spacing (Figma-like) hints and snapping

## What this legacy example demonstrates

- Basic “help while dragging” behavior for aligning nodes
- A minimal setup inside `<f-flow>` (legacy implementation)

If you are building a modern node editor, prefer **Magnetic Lines** + **Magnetic Rects** instead.

## Example

::: ng-component <help-in-positioning></help-in-positioning> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/help-in-positioning/help-in-positioning.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/help-in-positioning/help-in-positioning.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/help-in-positioning/help-in-positioning.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
