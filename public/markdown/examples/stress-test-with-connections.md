---
toc: false
wideContent: true
---

# Connection Redraw Performance

## Description

This example focuses on connection-heavy rendering rather than raw node count.
A central draggable node is connected to a large ring of surrounding nodes, so you can measure routing, marker rendering, and redraw cost while changing connection settings live.

What you can test in this demo:

- Dense fan-out graph: one output node connected to 25, 50, 75, 100, or 150 targets.
- Connection behavior switching: compare `fixed`, `fixed-center`, and `floating` routing behavior.
- Connection type switching: compare `straight`, `segment`, `bezier`, and `adaptive-curve` paths.
- Dynamic redraws: move the center node and watch all outgoing paths update in real time.
- Marker rendering: each connection includes custom start and end markers, so the example also stresses SVG marker usage under load.
- Side-aware targets: surrounding nodes define explicit connectable sides, which helps evaluate how side calculation affects the final route pattern.

Why this example is useful:

- Compare how different connection builders scale visually and computationally.
- See the redraw cost of many simultaneous connection updates from a single drag.
- Validate marker-heavy connection scenes before applying similar patterns in production editors.

## Example

::: ng-component <stress-test-with-connections></stress-test-with-connections> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/stress-test-with-connections/stress-test-with-connections.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/stress-test-with-connections/stress-test-with-connections.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/stress-test-with-connections/stress-test-with-connections.scss
:::
