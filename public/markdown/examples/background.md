# Background

## Description

The background feature allows you to render an SVG pattern underneath all nodes and connections on the [canvas](./docs/f-canvas-component).  
It is useful for creating grids, subtle textures, or branded backgrounds that stay fixed while the user interacts with the flow.

To enable a background, place the [f-background component](./docs/f-background-component) **inside** the [f-flow component](./docs/f-flow-component).  
The `f-background` component is responsible for defining and attaching the SVG pattern that will be used as the canvas background.

Backgrounds can work in three modes:

- **`rect`** – built-in rectangular pattern (useful for grid-like backgrounds);
- **`circle`** – built-in circular pattern;
- **`custom`** – a mode that lets you provide your **own SVG pattern**, so you can build complex or branded backgrounds (multiple patterns, custom shapes, textures, etc.).

The `custom` mode is configured via standard SVG `<pattern>` elements and a custom component.  
Detailed instructions and API for creating custom patterns are described in the [f-background documentation](./docs/f-background-component).

## Example

The example below shows how to:

- wrap `f-canvas` with `f-flow`;
- add `f-background` to enable a background;
- switch between the built-in `rect` and `circle` patterns;
- use the new `custom` mode with a custom background implementation.

::: ng-component <background-example></background-example> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/background-example/background-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/background-example/background-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/background-example/background-example.component.scss
[custom.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/background-example/custom-background-example/custom-background-example.html
[custom.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/background-example/custom-background-example/custom-background-example.ts
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
