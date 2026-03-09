---
toc: false
wideContent: true
---

# Connection Types

## Description

Compare the built-in connection shapes in Foblex Flow and see how different edge styles change the readability of the same graph. This is the fastest entry point when you are choosing a default routing style for a node editor or workflow builder.

## Example

::: ng-component <connection-types></connection-types> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-types/connection-types.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-types/connection-types.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-types/connection-types.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## Built-in connection types

- **Straight** for direct links with minimal routing logic.
- **Segment** for orthogonal paths, with `fOffset` and `fRadius` to shape corners and spacing.
- **Bezier** for smoother curved edges, also configurable with `fOffset` and `fRadius`.
- **Adaptive Curve** for a route that adjusts automatically to direction and distance.

Use the `fType` attribute on `<f-connection>` to switch between them.

## Extend it

If the built-in types are not enough, move to the [Custom Connection Type](./examples/custom-connection-type) example and build your own reusable edge behavior.
