---
toc: false
wideContent: true
summary: "Automatic graph relayout with Dagre and Foblex Flow auto mode."
primaryKeyword: "angular dagre auto layout example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-04-09"
updatedAt: "2026-04-09"
---

# Dagre Auto Layout

This page shows how to use `@foblex/flow-dagre-layout` together with Foblex Flow auto mode. The example still rebuilds the graph from component state, but it no longer calls `calculate(...)` manually. Instead, Flow renders the graph first, measures the nodes, and then asks Dagre to recalculate positions automatically.

The important split is:

- `@foblex/flow-dagre-layout` calculates node positions
- `@foblex/flow` detects graph changes, asks the engine to relayout, and redraws the scene
- your app still owns graph state through `writeback`

## How This Differs From The Manual Example

The manual example explicitly calls `calculate(...)` and usually passes a `size` for every node before rendering.

This auto example works differently:

1. The component rebuilds the source graph from toolbar state.
2. That graph is rendered in `f-flow`.
3. Flow calls `getState({ measuredSize: true })` internally and reads the actual rendered node size from the DOM.
4. Flow then runs Dagre automatically and sends the new positions back through `writeback`.

That is why this example does not pass node sizes into `generateGraph(...)`. Real measured sizes come from rendered nodes, and `defaultNodeSize` is only a fallback for cases where a measurement is not available yet.

## Example

::: ng-component <dagre-layout-auto></dagre-layout-auto> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/dagre-layout-auto/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/dagre-layout-auto/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/dagre-layout-auto/example.scss
[apply-layout.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/utils/apply-layout.ts
[generate-graph.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/utils/generate-graph.ts
[layout-connection-sides.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/utils/layout-connection-sides.ts
[layout-controls.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/utils/layout-controls.ts
:::

## Install

```bash
ng add @foblex/flow-dagre-layout
```

If you prefer manual installation:

```bash
npm install @foblex/flow @foblex/flow-dagre-layout @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

You do not need to install `dagre` separately because the adapter ships it as a runtime dependency.

## How Auto Mode Works

1. Provide the layout engine with `mode: EFLayoutMode.AUTO`.
2. Rebuild and render your nodes and connections in `f-flow`.
3. When the rendered graph changes, Flow collects measured node sizes and calls `calculate(...)` automatically.
4. Use `setInteractiveOptions(...)` to keep the engine in sync with toolbar state.
5. Use `setWriteback(...)` to sync calculated positions back into your application state.

## What This Example Shows

- Rebuilding the source graph reactively from toolbar state, just like the manual example
- Letting auto mode calculate positions after render instead of calling `calculate(...)` manually
- Measuring real rendered node sizes from Flow instead of passing `size` in the demo graph
- Keeping application state in sync through `writeback`
- Reusing the same graph factory as the manual example with less layout code in the component

## When To Choose Auto Mode

Use auto mode when you want Flow to orchestrate the layout cycle for you:

- render the graph
- measure nodes
- call the layout engine
- apply new positions
- redraw connections

Manual mode is still the better choice when you need full control over exactly when layout runs or when layout should happen outside the rendered Flow lifecycle.

## Related docs and examples

- [Dagre Layout Example](./examples/dagre-layout)
- [ELK.js Auto Layout Example](./examples/elk-layout-auto)
- [Package README](https://github.com/Foblex/f-flow/tree/main/libs/f-layout/dagre)
