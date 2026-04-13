# @foblex/flow-elk-layout

`@foblex/flow-elk-layout` adds a manual layout adapter for [ELK.js](https://github.com/kieler/elkjs) in [Foblex Flow](https://flow.foblex.com).

Use this package when you need richer layout strategies than a simple directed tree and want access to layered, radial, force-style, or other ELK.js algorithms while still rendering and interacting through Foblex Flow.

## Install

The easiest path is:

```bash
ng add @foblex/flow-elk-layout
```

If your app already manages Flow styles on its own, you can skip the default theme wiring:

```bash
ng add @foblex/flow-elk-layout --skipTheme
```

For Nx workspaces:

```bash
nx g @foblex/flow-elk-layout:add
```

`ng add` ensures these packages are present and only adds the missing ones:

- `@foblex/flow`
- `@foblex/platform`
- `@foblex/mediator`
- `@foblex/2d`
- `@foblex/utils`
- the ELK.js package itself

It also adds `node_modules/@foblex/flow/styles/default.scss` to application styles when the theme entry is missing.

If you prefer manual installation:

```bash
npm install @foblex/flow @foblex/flow-elk-layout @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

The underlying `elkjs` package is shipped as a runtime dependency of this package, so you do not need to install it separately.

## What The Engine Does

`ElkLayoutEngine` calculates node positions from:

- node ids
- optional node sizes
- source/target connections
- shared layout options such as direction, spacing, and algorithm
- optional ELK.js-specific `layoutOptions`

The engine returns only calculated node positions. Your app remains responsible for state management and for applying those positions to your own graph model.

For non-directional algorithms such as force, radial, random, or packing-oriented modes, the example integration can switch connectors into calculate mode so connection anchors follow the actual node geometry instead of a fixed left/right or top/bottom rule.

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
  EElkLayoutAlgorithm,
  ElkLayoutEngine,
} from '@foblex/flow-elk-layout';

@Component({
  standalone: true,
  providers: [provideFLayout(ElkLayoutEngine)],
  template: '',
})
export class WorkflowLayoutExample {
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

    const positions = new Map(result.nodes.map((node) => [node.id, node.position]));

    console.log(positions.get('A'));
  }
}
```

## Main Options

- `direction`: `EFLayoutDirection`
- `algorithm`: `EElkLayoutAlgorithm`
- `nodeGap`: spacing between nodes
- `layerGap`: spacing between layout layers
- `defaultNodeSize`: fallback size when a node does not provide `size`
- `layoutOptions`: raw ELK.js options passed through to the engine

Available algorithms:

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

## Typical Integration Flow

1. Build your own graph data.
2. Convert it to `IFLayoutNode[]` and `IFLayoutConnection[]`.
3. Call `calculate(...)`.
4. Merge returned positions into your view model.
5. Render nodes in `f-flow`.

## Example

- Live example: [https://flow.foblex.com/examples/elkjs-layout](https://flow.foblex.com/examples/elkjs-layout)
- Example source: [projects/f-examples/plugins/elk-layout](https://github.com/Foblex/f-flow/tree/main/projects/f-examples/plugins/elk-layout)

## When To Choose ELK.js

Choose ELK.js when you want:

- more layout algorithms
- richer spacing and routing controls
- denser or less tree-like graphs
- an engine you can tune further through raw ELK.js options
