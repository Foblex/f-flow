---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-04-08"
---

# Dagre Layout

This page shows how to use `@foblex/flow-dagre-layout` to calculate a manual graph layout with [Dagre](https://github.com/dagrejs/dagre) and then render the result with Foblex Flow.

The important split is:

- `@foblex/flow-dagre-layout` calculates positions
- `@foblex/flow` renders nodes, connections, zoom, drag, and viewport behavior
- your app remains the owner of graph state

## Example

::: ng-component <dagre-layout></dagre-layout> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/f-layout/dagre-layout/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/f-layout/dagre-layout/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/f-layout/dagre-layout/example.scss
[apply-layout.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/f-layout/utils/apply-layout.ts
[generate-graph.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/f-layout/utils/generate-graph.ts
[layout-connection-sides.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/f-layout/utils/layout-connection-sides.ts
[layout-controls.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/f-layout/utils/layout-controls.ts
:::

## Install

```bash
ng add @foblex/flow-dagre-layout
```

If your project already includes a custom Flow theme, you can keep schematic installation but skip style injection:

```bash
ng add @foblex/flow-dagre-layout --skipTheme
```

For Nx workspaces:

```bash
nx g @foblex/flow-dagre-layout:add
```

`ng add` checks `@foblex/flow` and the required Foblex companion packages, adds only the missing ones, and wires the default Flow theme into application styles when it is missing.

If you prefer manual installation:

```bash
npm install @foblex/flow @foblex/flow-dagre-layout @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

You do not need to install the underlying `dagre` package separately because the adapter ships it as a runtime dependency.

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
  DagreLayoutEngine,
  EDagreLayoutAlgorithm,
} from '@foblex/flow-dagre-layout';

@Component({
  standalone: true,
  providers: [provideFLayout(DagreLayoutEngine)],
  template: '',
})
export class DiagramComponent {
  private readonly _layout = inject(DagreLayoutEngine);

  protected async relayout(): Promise<void> {
    const nodes: IFLayoutNode[] = [
      { id: 'A' },
      { id: 'B' },
      { id: 'C' },
    ];
    const connections: IFLayoutConnection[] = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
    ];

    const result = await this._layout.calculate(nodes, connections, {
      direction: EFLayoutDirection.LEFT_RIGHT,
      algorithm: EDagreLayoutAlgorithm.NETWORK_SIMPLEX,
      nodeGap: 32,
      layerGap: 48,
    });

    console.log(result.nodes);
  }
}
```

`calculate(...)` returns only calculated node positions. In a real app you merge them back into your own node model by `id`.

## How To Work With It

1. Build your own graph state in the shape your app needs.
2. Convert that graph to `IFLayoutNode[]` and `IFLayoutConnection[]`.
3. Call `calculate(...)` on `DagreLayoutEngine`.
4. Merge returned positions back into your state.
5. Render the updated nodes in `f-flow`.

## Options You Will Usually Change

- `direction`: graph direction via `EFLayoutDirection`
- `algorithm`: Dagre ranker via `EDagreLayoutAlgorithm`
- `nodeGap`: spacing between nodes on the same level
- `layerGap`: spacing between levels
- `defaultNodeSize`: fallback size when a node does not provide `size`

## What This Example Shows

- Switching layout direction reactively
- Switching Dagre algorithms reactively
- Rebuilding the example graph from one graph factory
- Adding nodes and recalculating the layout
- Fitting the viewport after each render

## When to use it

Use Dagre when your diagram has a mostly hierarchical structure and you want a predictable directed layout for org charts, dependency graphs, or workflow trees.

## Related docs and examples

- [Dagre Auto Layout Example](./examples/dagre-layout-auto)
- [Package README](https://github.com/Foblex/f-flow/tree/main/libs/f-layout/dagre)
- [Angular Diagram Library](./docs/angular-diagram-library)
- [ELK.js Layout Example](./examples/elkjs-layout)
- [Flow Docs](./docs/f-flow-component)
