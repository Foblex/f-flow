# Zoom

## Description

This guide shows how to `zoom in` and `zoom out` of the [canvas](./docs/f-canvas-component) using:

- **Mouse wheel**
- **Double click**
- **Buttons**
- **Pinch-to-zoom** (trackpad / touchscreen)

To enable zooming, add the [fZoom directive](./docs/f-zoom-directive) to the [f-canvas](./docs/f-canvas-component).

### Notes

- **Pinch-to-zoom** works on devices that support multi-touch gestures (touch screens and trackpads).
- The directive applies zoom with sensible limits to keep interactions smooth and predictable.

## Example

::: ng-component <zoom></zoom> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/zoom/zoom.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/zoom/zoom.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/zoom/zoom.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
