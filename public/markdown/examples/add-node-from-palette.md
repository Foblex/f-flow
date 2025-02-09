# Adding a Node from the Palette

## Description

This guide shows how to add [fNode](./docs/f-node-directive) to the [f-canvas](./docs/f-canvas-component) using the [fExternalItem](./docs/f-external-item-directive) directive. 
The directive allows placing elements outside the [f-canvas](./docs/f-canvas-component) and moving them onto it.
It supports features like Preview and Placeholder elements to manage the visual representation during interactions. 
External items can be dragged onto the [f-canvas](./docs/f-canvas-component) while preserving predefined parameters using the **fData** attribute.

#### Directive Features

-	**fExternalItem** — links an element to the canvas, enabling movement and integration into the overall structure.
-	**fPlaceholder** and **fPreview** — provide mechanisms to add placeholder and preview elements.
-	**fPreviewMatchSize** — synchronizes the size of the **fExternalItem** with its preview to ensure consistent display.

## Example

::: ng-component <add-node-from-palette></add-node-from-palette> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::


