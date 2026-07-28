---
publishedAt: "2026-07-05"
updatedAt: "2026-07-28"
---

# ngx-graph Alternative

Verified on: **2026-07-28**.

[Swimlane ngx-graph](https://github.com/swimlane/ngx-graph) is an Angular graph **visualization** library. Its repository is active and has a `21.0.0-alpha.1` tag, so this page does not present Foblex Flow as a replacement for an abandoned project. It is a migration guide for a different requirement: moving from visualization-first graphs to a user-editable node editor.

## The honest difference in scope

- ngx-graph renders `nodes` and `links` with automatic layouts. Its primary model is visualization: arrange graph data and expose view interactions.
- Foblex Flow is an editor library: users drag nodes, create and reassign connections, select, resize, rotate, group, and edit routes. Optional Dagre and ELK packages add automatic arrangement when the editor needs it.

If all you need is an automatically laid-out visualization, ngx-graph may remain the more direct fit. Consider migration when users must _change_ the graph or when HTML-based Angular node content and editor interactions become core product requirements.

## Migrating from ngx-graph

The models are close enough that migration is mechanical for most apps:

- In the default stateless mode, ngx-graph `nodes` / `links` arrays stay your source of truth — Foblex Flow never owns your data. Render them with `@for` instead of passing them to a component input.
- A `node` template (`ng-template #nodeTemplate`) becomes a plain element with `fNode` and `[fNodePosition]` — with your full Angular component inside, not an SVG fragment. HTML instead of SVG is the biggest quality-of-life change: real inputs, buttons, pipes and directives inside nodes.
- A `link` becomes `<f-connection fSourceId fTargetId>` with built-in path types (straight, segment, bezier), markers and labels.
- Automatic layout (`dagre` in ngx-graph) maps to `@foblex/flow-dagre-layout` or `@foblex/flow-elk-layout` — run it on init or on demand, then keep user-made positions.
- `(select)`-style events map to `fSelectionChange`; panning/zooming to `f-canvas` + `fZoom`.

What has no ngx-graph equivalent — and therefore needs no migration — is everything editors need: connection creation by drag/click/keyboard, groups, resize handles, alignment guides, virtualization for large scenes, and an accessibility layer.

## Why teams pick Foblex Flow after ngx-graph

- HTML nodes with real Angular content instead of SVG templates.
- Interaction out of the box instead of view-only rendering.
- Scaling tools (virtualization, caching, background workers) when graphs grow.
- The stateless core never mutates your application-owned data — events in, your decisions out, same philosophy ngx-graph users already have.
- If you do want a ready-made store after migrating, the optional [Managed Flow State](./examples/state) plugin provides typed records, supported gesture writeback, snapshots and undo/redo without becoming mandatory.

## Try it

```bash
ng add @foblex/flow
```

Start with [Get Started](./docs/get-started), see automatic arrangement in the [Dagre layout example](./examples/dagre-layout), and browse the [examples gallery](./examples/overview) for the interactions ngx-graph never had.

Primary source checked: [swimlane/ngx-graph on GitHub](https://github.com/swimlane/ngx-graph).
