---
toc: false
wideContent: true
publishedAt: "2026-04-26"
updatedAt: "2026-04-26"
---

# Canvas Layer Ordering

Foblex Flow renders three built-in layers inside `<f-canvas>` — **groups**, **connections**, and **nodes** — each in its own absolutely-positioned container with its own stacking context. Until v18.6 the order was hardcoded: groups underneath, connections in the middle, nodes on top.

Most editors are fine with that. A few are not. A diagram view that uses semi-transparent group overlays needs the group layer **above** the nodes. A pipeline editor with edge labels you can click on needs **connections above nodes**. Layer Ordering exposes that single decision as configuration so you don't have to fight the library with `!important` z-index overrides.

This page is the live demo. The buttons swap the order of the three layers; the same group, the same nodes, and the same connections keep their data — only the stacking changes.

::: ng-component <canvas-layers></canvas-layers> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/canvas-layers/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/canvas-layers/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/canvas-layers/example.scss
:::

## How to set the order

Two equivalent ways. Use whichever fits your app's wiring better.

### Per-canvas — `[fLayers]` input

For a single canvas with its own ordering — the most common case — pass the order as an input on `<f-canvas>`. The order is read **bottom to top**: first entry sits underneath, last entry sits on top.

```html
<f-canvas [fLayers]="[EFCanvasLayer.GROUPS, EFCanvasLayer.NODES, EFCanvasLayer.CONNECTIONS]">
  <!-- groups, nodes, connections — connections drawn on top of everything -->
</f-canvas>
```

The input accepts either the `EFCanvasLayer` enum or the underlying string literals (`'groups'`, `'connections'`, `'nodes'`). Use the enum in TypeScript for IDE help; the string form is convenient for static templates and for binding from JSON-driven configuration.

### App-wide — `withFCanvas({ layers })` provider

For an app where every canvas should use the same non-default order, set it once at the host component's providers via `withFCanvas` inside `provideFFlow(...)`.

```ts
import { provideFFlow, withFCanvas, EFCanvasLayer } from '@foblex/flow';

@Component({
  providers: [
    provideFFlow(
      withFCanvas({
        layers: [EFCanvasLayer.GROUPS, EFCanvasLayer.NODES, EFCanvasLayer.CONNECTIONS],
      }),
    ),
  ],
})
export class MyEditor {}
```

Per-instance `[fLayers]` always wins over the app-wide value, so individual canvases can opt out without re-providing the feature.

## Behaviour notes

- **Missing layers are appended in their default position.** Passing `[EFCanvasLayer.NODES]` does not hide groups or connections — it just promotes nodes to the bottom and lets the other two settle behind it in their original order.
- **Unknown values and duplicates are silently dropped.** Hand-typed strings that don't match a layer name are ignored; repeated entries collapse to the first occurrence.
- **Individual nodes / connections / groups still stack against their own siblings.** Layer Ordering only controls the three top-level containers. Per-element CSS on `.f-node`, `.f-group`, `.f-connection-content` keeps working the way it always did.
- **The plugins outside `<f-canvas>`** — `<f-background>`, `<f-selection-area>`, `<f-minimap>` — are not part of Layer Ordering. Their stacking is controlled by their position inside the `<f-flow>` template.

## When to reach for it

Layer Ordering is not a feature most editors need. The default has been right for years. Reach for it when:

- A semi-transparent group overlay should visibly tint the nodes underneath it.
- Edge labels or buttons projected on connections must remain clickable when nodes overlap them.
- A custom render layer relies on connections being drawn last, after nodes, so its strokes are not occluded.

Outside those cases, leave it on default.
