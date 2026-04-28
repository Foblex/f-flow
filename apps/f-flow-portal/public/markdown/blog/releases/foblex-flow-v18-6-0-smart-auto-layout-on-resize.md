---
publishedAt: "2026-04-26"
updatedAt: "2026-04-26"
---

# Foblex Flow v18.6.0: Reflow on Resize and Layer Ordering

Foblex Flow v18.6.0 is the layout-interaction sequel to v18.5.0. The previous release made layout engines a first-class story for the **initial** render. This one makes layouts stay clean as the graph keeps **changing**, and gives you control over how the canvas itself is **stacked**.

Today I'm shipping **v18.6.0** with two features:

- **Reflow on Resize** — the new `withReflowOnResize` plugin. When a node grows or shrinks, the surrounding nodes shift automatically so the layout doesn't fall apart, with five small knobs that decide who moves, by how much, and what to do when shifts run out of room.
- **Layer Ordering** — the order of the three built-in canvas layers (groups, connections, nodes) is now configurable. `[fLayers]` per canvas, or `withFCanvas({ layers })` app-wide.

Two independent changes, shipped together because they were both ready.

## Highlights

**Reflow on Resize**

- 🧭 **`withReflowOnResize`** — one-line install, reacts to any size change, no manual relayout call.
- 🎛️ **Five orthogonal knobs** — mode, scope, axis, delta source, collision. Each one controls one decision and stays out of the way of the others.
- 📌 **`fReflowIgnore` directive** — pin annotations, legends, and stats panels so they never get shifted.
- ⚙️ **`FReflowController`** — change any knob at runtime without re-providing the plugin.
- 🔁 **Standard `(fMoveNodes)` pipeline** — shifts go through your normal write path, not a back door.

**Layer Ordering**

- 🗂️ **`[fLayers]` input** — per-canvas control over the order of groups, connections, and nodes.
- 🧩 **`withFCanvas({ layers })` provider** — set the same default once for every canvas in the host component's tree.
- 🛡️ **Default unchanged** — groups → connections → nodes stays the default, so existing apps are unaffected.

## Why Reflow on Resize Matters

Real graphs do not have static node sizes.

A node expands when its details panel opens. It shrinks when async data finishes loading. It grows when the user types a longer label. As soon as one node changes size, every other node nearby is suddenly in the wrong place — overlapping, blocking the path of an edge, breaking the carefully arranged columns.

Up to v18.5.0, the answer was either "trigger a full relayout after every size change" or "don't let nodes change size". Both are workable. Neither feels right in a real editor.

`withReflowOnResize` is the version of this problem I wanted to ship for a while. It watches every node in the canvas and, the moment a size changes, shifts the surrounding nodes so the layout stays clean. No manual relayout, no graph rebuild — the consumer model just receives the new positions through the standard `(fMoveNodes)` pipeline.

## How It Works

Installation is one line:

```ts
import { provideFFlow, withReflowOnResize } from '@foblex/flow';

@Component({
  providers: [provideFFlow(withReflowOnResize())],
})
export class MyFlow {}
```

That is the whole installation. No directives to attach, no events to subscribe to.

The plugin reacts to **any** size change. User-driven resize handles work too, but they are not the point — they are the easiest way to demonstrate each option.

::: ng-component <reflow-basics></reflow-basics> [height]="600"
:::

Three nodes, no resize handles. The source grows when its inner block toggles open. The plugin notices and shifts the nodes underneath. Replace the toggle with any real-world driver — a collapsible card, lazy-loaded payload, dynamic text — and the behaviour is the same.

## Mode and Scope: Who Moves, How Far

The behaviour is configurable because "shift nearby nodes" is too vague for real layouts. The planner combines a **mode**, a **scope**, an axis, a delta source, and a collision resolver. Each knob picks one decision and stays out of the way of the others.

Two of them carry most of the user-facing weight: **mode** and **scope**.

`mode` decides **which nodes are eligible to shift** when the source resizes:

- **`CENTER_OF_MASS`** _(default)_ — every node whose centre lies past the source's centre on the resize axis. No connection or column alignment required.
- **`X_RANGE`** — same idea, narrowed to nodes that overlap the source on the perpendicular axis. Useful for column-based layouts where a vertical resize should only push the same column.
- **`DOWNSTREAM_CONNECTIONS`** — only nodes reachable from the source via outgoing connections. Pipeline-style editors rely on this so a resize doesn't disturb unrelated branches.

::: ng-component <reflow-mode></reflow-mode> [height]="600"
:::

`scope` decides **how far the plan is allowed to look** — same source resize, different blast radius:

- **`GLOBAL`** _(default)_ — every node and group on the canvas is eligible.
- **`GROUP`** — restricted to the source's siblings. Use it when each group should behave like an isolated workspace.
- **`CONNECTED_SUBGRAPH`** — BFS from the source over connections in both directions. Disconnected islands stay still.

That sounds like a lot of options for one feature, but it matters in real editors. A vertical resize inside a column-based architecture diagram should only push the same column. A resize inside a workflow group shouldn't disturb a sibling group three columns away. The same plugin covers both — you just pick the knob.

## Collision and Pinned Nodes

When a shifting candidate would overlap a stationary node, `collision` decides who gives way:

- **`STOP`** _(default)_ — the shifting candidate is clamped at the spacing line in front of the anchor. The remainder of the delta is dropped.
- **`CHAIN_PUSH`** — the anchor is absorbed into the plan and pushed too. Bounded by `maxCascadeDepth`. Useful for dense layouts where you'd rather everything cascade than have shifts visually disappear.

For nodes that should always stay pinned regardless of what the rest of the graph does — annotations, legend labels, stats panels — the new `fReflowIgnore` directive is the explicit opt-out:

```html
<div fNode fReflowIgnore [fNodePosition]="legendPosition">
  Legend
</div>
```

`fReflowIgnore` nodes never receive a primary shift, but they stay visible to the collision resolver as obstacles. That distinction matters more than it sounds — a "stationary but visible" anchor is what makes `CHAIN_PUSH` useful in a layout that has a fixed legend.

## Runtime Control

Static configuration covers the common case. For editors that want to expose the knobs to end users — a settings panel, a debugging overlay, an A/B test — `FReflowController` is the runtime entry point:

```ts
private readonly _reflow = inject(FReflowController);

public switchToConnectedScope(): void {
  this._reflow.update({ scope: EFReflowScope.CONNECTED_SUBGRAPH });
}
```

Every knob can be changed at runtime. No re-provisioning the plugin, no rebuilding the flow.

## What the Library Does Not Do

The reflow plugin moves existing nodes. It does not restructure the graph, it does not reroute connections, and it does not decide whether the resize itself is allowed.

Foblex Flow handles the geometric shift, your application owns the data model. The new positions arrive through `(fMoveNodes)` like any other node move, and you decide whether to persist them.

That boundary is intentional. Reflow is interaction infrastructure, not a layout authority.

## Why Layer Ordering Matters

Reflow on Resize is about how nodes move. Layer Ordering is about how the canvas is **stacked**.

Foblex Flow renders three built-in layers inside `<f-canvas>` — **groups**, **connections**, and **nodes** — each in its own absolutely-positioned container with its own stacking context. Until v18.6.0 the order was hardcoded: groups underneath, connections in the middle, nodes on top.

That default has been right for the vast majority of editors for years, and it stays the default in v18.6.0. But a few editors really aren't the default — and until now, the only way to change the order was to fight the library with global `!important` z-index overrides:

- A diagram view with semi-transparent group overlays needs the group layer **above** the nodes so the tint is actually visible.
- A pipeline editor with clickable edge labels needs **connections above nodes** so the labels stay reachable when nodes overlap them.
- A custom render layer that draws on top of connections needs the connection container drawn last so its strokes are not occluded.

Layer Ordering exposes that single decision as configuration, so the library stops standing in your way for those layouts.

## How to Set the Order

Two equivalent entry points — pick whichever fits the wiring of your app:

```html
<!-- Per-canvas: groups, nodes, connections — connections drawn on top -->
<f-canvas [fLayers]="[EFCanvasLayer.GROUPS, EFCanvasLayer.NODES, EFCanvasLayer.CONNECTIONS]">
  <!-- ... -->
</f-canvas>
```

```ts
// App-wide: same default for every canvas in the host component's tree
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

Per-canvas `[fLayers]` always wins over the app-wide value, so individual canvases can opt out without re-providing the feature. Missing layers fall back to their default position, and unknown values or duplicates are silently dropped — passing `[EFCanvasLayer.NODES]` does not hide groups or connections, it just promotes nodes to the bottom and lets the other two settle behind it.

::: ng-component <canvas-layers></canvas-layers> [height]="500"
:::

Layer Ordering only controls those three top-level containers. Per-element CSS on `.f-node`, `.f-group`, `.f-connection-content` keeps working the way it always did, and the plugins outside `<f-canvas>` — `<f-background>`, `<f-selection-area>`, `<f-minimap>` — are not part of it; their stacking is controlled by their position inside the `<f-flow>` template.

## Closing

The two features in v18.6.0 sit at different layers of the library, but they share a theme: making the canvas behave the way real editors actually need it to behave, without forcing application code to fight the library.

Reflow on Resize is about ongoing editing. v18.5.0 made it easy to put a graph on the screen with Dagre or ELK — that is layout for the **initial** render. v18.6.0 makes layout work while the user is actually using the editor: when nodes change size, when content streams in, when a card toggles open. That is the part that decides whether an editor feels well-built once you actually use it.

Layer Ordering is about the canvas's own visual contract. The default stacking has been right for years and stays the default, but for the editors that need a different order, the choice is now a configuration call instead of a `!important` z-index war.

If you're building a visual editor in Angular and want a native Angular solution (not a React wrapper) — take a look.

And if you like what I'm building, please consider starring the repo ⭐

It helps the project a lot.

## Release Links

- Release: <https://github.com/Foblex/f-flow/releases/tag/v18.6.0>
- Changelog: <https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md>
- Reflow on Resize example: <https://flow.foblex.com/examples/reflow-on-resize>
- Canvas Layers example: <https://flow.foblex.com/examples/canvas-layers>
- Roadmap: <https://flow.foblex.com/docs/roadmap>
