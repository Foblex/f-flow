# Minimap

## Description

This guide shows how to create a minimap that shows the entire canvas and allows you to navigate the canvas by dragging the minimap.

You can set custom class for each node and group in the minimap using `fMinimapClass: string | string[];` node property.

The minimap can be wrapped in any container, but it must remain inside the main flow component. This allows you to add action buttons or other UI controls around it. We recommend applying the fDragBlocker directive to any controls in the action panel to prevent unintentional canvas dragging when interacting with those buttons.
## Example

::: ng-component <minimap-example></minimap-example> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/minimap-example/minimap-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/minimap-example/minimap-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/minimap-example/minimap-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::



