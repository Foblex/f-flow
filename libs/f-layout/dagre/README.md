# @foblex/flow-dagre-layout

`@foblex/flow-dagre-layout` adds a manual layout adapter for [Dagre](https://github.com/dagrejs/dagre) in [Foblex Flow](https://flow.foblex.com).

Use this package when your graph is mostly hierarchical and you want predictable left-to-right or top-to-bottom layout for workflows, trees, dependency maps, or org-chart style editors.

## Install

The easiest path is:

```bash
ng add @foblex/flow-dagre-layout
```

If your app already manages Flow styles on its own, you can skip the default theme wiring:

```bash
ng add @foblex/flow-dagre-layout --skipTheme
```

For Nx workspaces:

```bash
nx g @foblex/flow-dagre-layout:add
```

`ng add` ensures these packages are present and only adds the missing ones:

- `@foblex/flow`
- `@foblex/platform`
- `@foblex/mediator`
- `@foblex/2d`
- `@foblex/utils`
- the Dagre package itself

It also adds `node_modules/@foblex/flow/styles/default.scss` to application styles when the theme entry is missing.

If you prefer manual installation:

```bash
npm install @foblex/flow @foblex/flow-dagre-layout @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

The underlying `dagre` package is shipped as a runtime dependency of this package, so you do not need to install it separately.

## What The Engine Does

`DagreLayoutEngine` calculates node positions from:

- node ids
- optional node sizes
- source/target connections
- layout options such as direction, spacing, and algorithm

The engine returns only calculated node positions. Your app stays in charge of graph state and decides how to merge those positions back into your own node model.

## Minimal Setup

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
export class WorkflowLayoutExample {
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

    const positions = new Map(result.nodes.map((node) => [node.id, node.position]));

    console.log(positions.get('A'));
  }
}
```

## Main Options

- `direction`: `EFLayoutDirection`
- `algorithm`: `EDagreLayoutAlgorithm`
- `nodeGap`: horizontal or sibling spacing
- `layerGap`: spacing between ranks or levels
- `defaultNodeSize`: fallback size when a node does not provide `size`

Available algorithms:

- `EDagreLayoutAlgorithm.NETWORK_SIMPLEX`
- `EDagreLayoutAlgorithm.TIGHT_TREE`
- `EDagreLayoutAlgorithm.LONGEST_PATH`

## Typical Integration Flow

1. Build your own graph data.
2. Convert it to `IFLayoutNode[]` and `IFLayoutConnection[]`.
3. Call `calculate(...)`.
4. Merge returned positions into your view model.
5. Render nodes in `f-flow`.

## Example

- Live example: [https://flow.foblex.com/examples/dagre-layout](https://flow.foblex.com/examples/dagre-layout)
- Example source: [libs/f-examples/plugins/dagre-layout](https://github.com/Foblex/f-flow/tree/main/libs/f-examples/plugins/dagre-layout)

## When To Choose Dagre

Choose Dagre when you want:

- fast directed layout
- tree-like or layered structure
- simple and predictable spacing controls
- a smaller option surface than ELK.js
