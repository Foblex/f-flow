---
toc: false
wideContent: true
summary: "Use ELK.js to compute richer manual layouts for graph UIs."
primaryKeyword: "angular elk layout example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-04-08"
---

# ELK.js Layout

This page shows how to use `@foblex/flow-elk-layout` to calculate a manual graph layout with [ELK.js](https://github.com/kieler/elkjs) and then render the result with Foblex Flow.

The important split is:

- `@foblex/flow-elk-layout` calculates positions with ELK.js
- `@foblex/flow` renders nodes, connections, zoom, drag, and viewport behavior
- your app remains the owner of graph state

## Example

::: ng-component <elk-layout></elk-layout> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/plugins/elk-layout/elk-layout.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/plugins/elk-layout/elk-layout.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/plugins/elk-layout/elk-layout.scss
[apply-layout.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/plugins/utils/apply-layout.ts
[generate-graph.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/plugins/utils/generate-graph.ts
[layout-connection-sides.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/plugins/utils/layout-connection-sides.ts
[layout-controls.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/plugins/utils/layout-controls.ts
:::

## Install

```bash
ng add @foblex/flow-elk-layout
```

If your project already includes a custom Flow theme, you can keep schematic installation but skip style injection:

```bash
ng add @foblex/flow-elk-layout --skipTheme
```

For Nx workspaces:

```bash
nx g @foblex/flow-elk-layout:add
```

`ng add` checks `@foblex/flow` and the required Foblex companion packages, adds only the missing ones, and wires the default Flow theme into application styles when it is missing.

If you prefer manual installation:

```bash
npm install @foblex/flow @foblex/flow-elk-layout @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

You do not need to install the underlying `elkjs` package separately because the adapter ships it as a runtime dependency.

## Minimal Usage

```ts
import { Component, inject } from '@angular/core';
import {
  EFLayoutDirection,
  IFLayoutConnection,
  IFLayoutNode,
  provideFLayout,
} from '@foblex/flow';
import {
  EElkLayoutAlgorithm,
  ElkLayoutEngine,
} from '@foblex/flow-elk-layout';

@Component({
  standalone: true,
  providers: [provideFLayout(ElkLayoutEngine)],
  template: '',
})
export class DiagramComponent {
  private readonly _layout = inject(ElkLayoutEngine);

  protected async relayout(): Promise<void> {
    const nodes: IFLayoutNode[] = [
      { id: 'A' },
      { id: 'B' },
      { id: 'C' },
    ];
    const connections: IFLayoutConnection[] = [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
    ];

    const result = await this._layout.calculate(nodes, connections, {
      direction: EFLayoutDirection.TOP_BOTTOM,
      algorithm: EElkLayoutAlgorithm.LAYERED,
      nodeGap: 32,
      layerGap: 48,
      layoutOptions: {
        'elk.layered.spacing.nodeNodeBetweenLayers': '64',
      },
    });

    console.log(result.nodes);
  }
}
```

`calculate(...)` returns only calculated node positions. In a real app you merge them back into your own node model by `id`.

In the demo integration, non-directional `ELK.js` algorithms automatically switch connectors into calculate mode so anchors adapt to the actual node placement.

## How To Work With It

1. Build your own graph state in the shape your app needs.
2. Convert that graph to `IFLayoutNode[]` and `IFLayoutConnection[]`.
3. Call `calculate(...)` on `ElkLayoutEngine`.
4. Merge returned positions back into your state.
5. Render the updated nodes in `f-flow`.

## Options You Will Usually Change

- `direction`: graph direction via `EFLayoutDirection`
- `algorithm`: ELK.js algorithm via `EElkLayoutAlgorithm`
- `nodeGap`: spacing between nodes
- `layerGap`: spacing between layers
- `defaultNodeSize`: fallback size when a node does not provide `size`
- `layoutOptions`: raw ELK.js options forwarded to the engine

Available algorithms in the adapter:

- `EElkLayoutAlgorithm.FIXED`
- `EElkLayoutAlgorithm.BOX`
- `EElkLayoutAlgorithm.RANDOM`
- `EElkLayoutAlgorithm.LAYERED`
- `EElkLayoutAlgorithm.STRESS`
- `EElkLayoutAlgorithm.MRTREE`
- `EElkLayoutAlgorithm.RADIAL`
- `EElkLayoutAlgorithm.FORCE`
- `EElkLayoutAlgorithm.DISCO`
- `EElkLayoutAlgorithm.SPORE_OVERLAP`
- `EElkLayoutAlgorithm.SPORE_COMPACTION`
- `EElkLayoutAlgorithm.RECT_PACKING`

## What This Example Shows

- Switching layout direction reactively
- Switching ELK.js algorithms reactively
- Rebuilding the example graph from one graph factory
- Adding nodes and recalculating the layout
- Passing shared options and ELK.js-specific options through one API

## When to use it

- Generate automatic layouts for complex or dense graphs.
- Recompute node placement after data changes.
- Compare freeform editing with layout-assisted views.

If layout quality matters more than minimal configuration, ELK.js is usually the better starting point than a simpler tree-only approach.

## Related docs and examples

- [ELK.js Auto Layout Example](./examples/elk-layout-auto)
- [Package README](https://github.com/Foblex/f-flow/tree/main/projects/f-layout/layout-elk)
- [Dagre Layout Example](./examples/dagre-layout)
- [Zoom Docs](./docs/f-zoom-directive)
- [Angular Node-Based UI Library](./docs/angular-node-based-ui-library)
