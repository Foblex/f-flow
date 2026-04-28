---
toc: false
wideContent: true
publishedAt: "2026-04-25"
updatedAt: "2026-04-26"
---

# Reflow on Resize

Real graphs don't have static node sizes. A node expands when its details panel opens, shrinks when async data loads, grows when the user types a longer label. As soon as one node changes size, every other node nearby is suddenly in the wrong place — overlapping, blocking the path of an edge, breaking the carefully arranged columns.

`withReflowOnResize` is the plugin that fixes this. It watches every node in the canvas and, the moment a size changes, shifts the surrounding nodes so the layout stays clean. No manual relayout call, no graph rebuild — the consumer model just receives the new positions through the standard `(fMoveNodes)` pipeline.

The plugin reacts to **any** size change. User-driven resize handles work too, but they aren't the point — they're the easiest way to demonstrate each option on this page.

The behaviour is configurable. A planner combines a **mode**, a **scope**, an **axis**, a **delta source**, and a **collision resolver** — five orthogonal knobs that decide who moves, by how much, and what to do when shifts run out of room. Each section below picks one knob, locks the rest at sensible defaults, and shows you the difference.

## Installation

```typescript
import { provideFFlow, withReflowOnResize } from '@foblex/flow';

@Component({
  providers: [provideFFlow(withReflowOnResize())],
})
export class MyFlow {}
```

That is the whole installation. No directives to attach, no events to subscribe to.

## Basics

The simplest case — and the one the plugin was designed for. Three nodes, no resize handles. The source grows when its inner block toggles open. The plugin notices and shifts the nodes underneath. Replace the toggle with any real-world driver — a collapsible card, lazy-loaded payload, dynamic text — and the behaviour is the same.

::: ng-component <reflow-basics></reflow-basics> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/basics/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/basics/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/basics/example.scss
:::

The remaining sections wire a resize handle onto the source so you can poke each option deliberately. The plugin reacts the same way regardless of what changes the size.

## Mode — who becomes a candidate

`mode` decides **which nodes are eligible to shift** when the source resizes. The scene has a connected chain leaving the source (`Source → Connected → Connected`) and two unconnected nodes nearby. Drag any handle on the source and switch the dropdown:

- **`CENTER_OF_MASS`** _(default)_ — picks every node whose centre lies past the source's centre on the resize axis. Nothing else is required: no connection, no parent, no column alignment.
- **`X_RANGE`** — same idea, narrowed to nodes that overlap the source on the perpendicular axis. Useful when the layout is column-based and a vertical resize should only push the same column.
- **`DOWNSTREAM_CONNECTIONS`** — only nodes reachable from the source via outgoing connections. The chain follows; unconnected nodes stay put. Pipeline-style editors rely on this so a resize doesn't disturb unrelated branches.

::: ng-component <reflow-mode></reflow-mode> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/mode/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/mode/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/mode/example.scss
:::

## Scope — how far the plan reaches

`scope` decides **how far the plan is allowed to look**. Same source resize, different blast radius. The scene puts the source inside a `Workflow` group together with a sibling, plus three nodes outside the group: one connected to the source, one disconnected, and a separate `Node ↔ Node` island in the bottom-right.

- **`GLOBAL`** _(default)_ — every node and group on the canvas is eligible.
- **`GROUP`** — restricted to the source's siblings (same `fNodeParentId`). Nothing outside the group is touched. Use it when each group should behave like an isolated workspace.
- **`CONNECTED_SUBGRAPH`** — BFS from the source over connections in both directions. Only nodes reachable from the source via the graph follow it. The disconnected external node and the island stay still.

::: ng-component <reflow-scope></reflow-scope> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/scope/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/scope/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/scope/example.scss
:::

## Collision — what happens when shifts run out of room

When a shifting candidate would overlap a **stationary** node, `collision` decides who gives way. To create a stationary node deliberately, the bottom node in this scene carries the `fReflowIgnore` directive — it never receives a primary shift, but it stays visible to the collision resolver as an obstacle.

Drag the source down toward the anchored node and switch the rule:

- **`STOP`** _(default)_ — the shifting candidate is clamped at the spacing line in front of the anchor. The remainder of the delta is dropped, the anchor doesn't move.
- **`CHAIN_PUSH`** — the anchor is absorbed into the plan and pushed too. If it then collides with the next node, that one moves as well, bounded by `maxCascadeDepth`. Useful for dense layouts where you'd rather everything cascade than have shifts visually disappear.

::: ng-component <reflow-collision></reflow-collision> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/collision/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/collision/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/collision/example.scss
:::

`fReflowIgnore` is the directive you reach for when a node has to stay pinned regardless of what the rest of the graph does — annotations, legend labels, stats panels.

## Delta source — by how much each candidate moves

`deltaSource` decides how the shift magnitude is computed once a candidate is picked. The source has only the **top** and **bottom** handles — drag the **top** handle upward to see the difference clearly: the source grows, but only its top edge moves; the bottom stays where it is.

- **`EDGE_BASED`** _(default, recommended)_ — each candidate follows the edge that actually moved. Top edge moved up → only the node above is pushed up. Bottom stayed put → the node below stays put.
- **`CENTER_BASED`** — the full size delta is applied to candidates picked by centre comparison. The node below shifts down even though the source's bottom edge never moved, because the source's centre moved up. Visibly wrong for asymmetric resize.

`EDGE_BASED` is the right choice in almost every case. `CENTER_BASED` is kept for layouts where every resize is symmetric (always grows from the centre).

::: ng-component <reflow-delta-source></reflow-delta-source> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/delta-source/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/delta-source/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/delta-source/example.scss
:::

## Axis — which directions trigger reflow

`axis` filters which size changes the plan reacts to. The source carries all four directional handles and sits in the middle of four cardinal neighbours.

- **`BOTH`** _(default)_ — vertical and horizontal passes run independently. Drag any handle and the matching neighbour follows.
- **`VERTICAL`** — only height changes count. Dragging the left or right handles pushes nothing.
- **`HORIZONTAL`** — only width changes count. Dragging the top or bottom handles pushes nothing.

Switch to `VERTICAL` or `HORIZONTAL` when one of the axes is fully managed by your own layout (e.g. you snap nodes to a column grid) and you don't want reflow second-guessing it.

::: ng-component <reflow-axis></reflow-axis> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/axis/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/axis/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/axis/example.scss
:::

## Runtime config via `FReflowController`

`FReflowController` is provided at the same injector as `provideFFlow(...)`, so any component below the provider can inject it directly:

```typescript
private readonly _reflow = inject(FReflowController);

toggle(): void {
  this._reflow.setConfig({ enabled: !this._reflow.getConfig().enabled });
}
```

`setConfig(...)` accepts a partial config and merges it with what's already there. The change takes effect on the next resize — no provider rebuild, no graph rebuild. Use it for runtime UI: a "freeze layout" toggle while a user does bulk edits, switching `mode` from `CENTER_OF_MASS` to `DOWNSTREAM_CONNECTIONS` when entering a different editing mode, etc.

Click _Disable reflow_, drag the source's bottom handle: the neighbours stay put. Re-enable and the next drag does shift them again.

::: ng-component <reflow-pattern-live></reflow-pattern-live> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/pattern-live-controller/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/pattern-live-controller/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/plugins/reflow-on-resize/pattern-live-controller/example.scss
:::
