# Connection Types

## Description

This example demonstrates how to use different **connection types** between nodes in foblex flow.
Each type defines how the link between connectors is drawn — from a simple straight line to a smooth adaptive curve.

The example includes four built-in connection types:

- **Straight** — a direct straight line between nodes.
- **Segment** — an orthogonal connection composed of straight segments.
  You can configure:
  - **fOffset** — the distance from the node to the first/last segment.
  - **fRadius** — the corner-rounding radius for bends between segments.
- **Bezier** — a smooth cubic Bézier curve.
  Supports additional parameters:
  - **fOffset** — the distance from the connection point to where the curve begins.
  - **fRadius** — a factor controlling the curvature intensity.
- **Adaptive Curve** — a smart, context-aware curve that automatically adjusts its shape based on the direction and distance between nodes, creating a more natural flow.

You can select the connection style using the fType attribute on the <f-connection> element.

If the built-in types are not enough, you can also create a custom connection type.
See the example and full guide here:
[👉 Creating a Custom Connection Type](./examples/custom-connection-type).

## Example

::: ng-component <connection-types></connection-types> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-types/connection-types.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-types/connection-types.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-types/connection-types.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
