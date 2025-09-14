# Dagre Tree

## Description

This example demonstrates automatic graph layout using [dagre.js](https://github.com/dagrejs/dagre) together with Foblex Flow and Angular.
The component builds a tree from a set of nodes and edges, computes positions using dagre.layout(graph), and renders nodes and connections on the Flow canvas.

### What this example shows

- Switching layout direction: Left→Right and Top→Bottom.
- Auto Layout toggle — when enabled, flow.reset() is called before each recalculation and nodes are repositioned using Dagre results.
- Automatic viewport fitting: fitToScreen(...) after the flow has been loaded.

### Technical details

- The graph is built using dagre.graphlib.Graph: nodes come from GRAPH_DATA, edges are defined by parentId.
- After calling dagre.layout, node coordinates are mapped into nodes() with { x, y } positions, and edges into connections().

## Example

::: ng-component <dagre-layout></dagre-layout> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/dagre-layout/dagre-layout.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/dagre-layout/dagre-layout.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/dagre-layout/dagre-layout.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
