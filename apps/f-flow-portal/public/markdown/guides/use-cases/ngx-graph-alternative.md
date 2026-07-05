---
publishedAt: "2026-07-05"
updatedAt: "2026-07-05"
---

# ngx-graph Alternative

ngx-graph served Angular teams well as a graph **visualization** library, but its last release was years ago and the repository is effectively unmaintained, while tens of thousands of projects still install it weekly. If you are choosing today — or maintaining an app stuck on it — Foblex Flow is the actively maintained Angular-native option, and it covers a wider job: not just rendering a graph, but letting users edit it.

## The honest difference in scope

- ngx-graph renders a graph from data with automatic layouts. Interaction is mostly viewing: pan, zoom, click.
- Foblex Flow is an editor toolkit: dragging nodes, creating and reassigning connections, selection, resize/rotate, minimap, snapping, undo-friendly events — plus optional auto-layout via the Dagre and ELK packages when you want ngx-graph-style automatic arrangement.

If all you need is a static, auto-laid-out visualization and you never touch it again, a dead-but-working dependency may hold for a while. The moment users need to _change_ the graph — or you need Angular 17+ support, signals, SSR, or bug fixes — you need a maintained editor library.

## Migrating from ngx-graph

The models are close enough that migration is mechanical for most apps:

- ngx-graph `nodes` / `links` arrays stay your source of truth — Foblex Flow never owns your data. Render them with `@for` instead of passing them to a component input.
- A `node` template (`ng-template #nodeTemplate`) becomes a plain element with `fNode` and `[fNodePosition]` — with your full Angular component inside, not an SVG fragment. HTML instead of SVG is the biggest quality-of-life change: real inputs, buttons, pipes and directives inside nodes.
- A `link` becomes `<f-connection fSourceId fTargetId>` with built-in path types (straight, segment, bezier), markers and labels.
- Automatic layout (`dagre` in ngx-graph) maps to `@foblex/f-dagre-layout` or `@foblex/f-elkjs-layout` — run it on init or on demand, then keep user-made positions.
- `(select)`-style events map to `fSelectionChange`; panning/zooming to `f-canvas` + `fZoom`.

What has no ngx-graph equivalent — and therefore needs no migration — is everything editors need: connection creation by drag/click/keyboard, groups, resize handles, alignment guides, virtualization for large scenes, and an accessibility layer.

## Why teams pick Foblex Flow after ngx-graph

- Actively maintained: frequent releases, issues answered, Angular 17.3+ targeted, strict SemVer.
- HTML nodes with real Angular content instead of SVG templates.
- Interaction out of the box instead of view-only rendering.
- Scaling tools (virtualization, caching, background workers) when graphs grow.
- The library never mutates your data — events in, your decisions out, same philosophy ngx-graph users already have.

## Try it

```bash
ng add @foblex/flow
```

Start with [Get Started](./docs/get-started), see automatic arrangement in the [Dagre layout example](./examples/dagre-layout), and browse the [examples gallery](./examples/overview) for the interactions ngx-graph never had.
