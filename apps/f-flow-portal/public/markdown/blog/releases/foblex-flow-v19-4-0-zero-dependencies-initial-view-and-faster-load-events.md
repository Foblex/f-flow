---
publishedAt: "2026-10-25"
updatedAt: "2026-10-25"
---

# Foblex Flow v19.4.0: Zero Dependencies, Initial View, and Faster Load Events

Today I'm shipping **v19.4.0**. The headline is simple to state: the library now depends on nothing but Angular. The four `@foblex/*` runtime packages are gone from your `package.json` — their code ships inside `@foblex/flow`, and `ng update` rewrites your imports for you.

The release adds:

- **Zero dependencies** - `@foblex/platform`, `@foblex/mediator`, `@foblex/utils`, and `@foblex/2d` are bundled into the library; `npm install @foblex/flow` is the whole install.
- **Initial View** - the flow can appear already fitted or centered on its first visible frame, with no jump from the default viewport.
- **Faster load events** - `fNodesRendered` / `fFullRendered` fire as soon as the first render settles, about 120ms earlier than before.
- **Reflow-on-resize fixed** - a top or left-handle resize no longer silently kills the reflow feature for that node.
- **SSR hardening** - `*fVirtualFor` and `<f-minimap>` no longer crash server rendering.

There are no breaking changes. `ng update @foblex/flow` performs the dependency migration automatically.

## Zero Dependencies

Until now, installing Foblex Flow meant installing five packages: the library plus `@foblex/2d`, `@foblex/utils`, `@foblex/platform`, and `@foblex/mediator`. They were all mine, all required, and all a source of friction — version matching, peer warnings, one more thing to go wrong in every upgrade.

v19.4 ends that. The four packages are vendored into the library, and the peer dependency list is now exactly two entries: `@angular/common` and `@angular/core`.

```bash
npm install @foblex/flow
```

The geometry types came along as first-class API. `IPoint`, `IRect`, `ISize`, `RoundedRect`, `PointExtensions` and the rest of the 2d toolkit are now imported from the library itself — this is the canonical form going forward:

```ts
import { FFlowModule, IPoint, PointExtensions } from '@foblex/flow';
```

The mediator and utils re-exports exist so migrated code keeps compiling, but they are marked `@deprecated` and leave the public API in v20 — they are internal infrastructure, not flow APIs. The standalone packages stay published on npm for code that uses them outside the flow.

One more thing surfaced while wiring this up: the `ng-update` migration entry was missing entirely in earlier releases, so `ng update @foblex/flow` never ran migrations. That is fixed — the update now rewrites imports of all four packages to `@foblex/flow` and removes the obsolete dependencies from your `package.json`.

## Initial View

A flow renders at the default position and scale, and only then your `(fFullRendered)` handler fits or centers it. Users see the jump. Every demo on this site had it; most real apps do too.

v19.4 removes it. With the **initial view** feature the flow renders invisibly — layout and measurements still happen — your handler sets the viewport up, and the flow is revealed only after the transform is applied. The first visible frame is the fitted one.

Two ways to turn it on. The template way:

```html
<f-flow fInitialView (fFullRendered)="loaded()">
  <f-canvas> ... </f-canvas>
</f-flow>
```

Or through providers, next to the other features:

```ts
providers: [provideFFlow(withInitialView())],
```

The hook is the same `(fFullRendered)` output you already use — call `fitToScreen` or `centerGroupOrNode` with `animated: false` there, and the reveal shows the final state. A bound `fInitialView` input overrides the provider feature in both directions, so one flow can opt out of a shared configuration.

✅ Live demo: [https://flow.foblex.com/examples/initial-view](https://flow.foblex.com/examples/initial-view)

## Load Events Without the Wall Clock

`fNodesRendered` and `fFullRendered` used to wait out a fixed 120ms debounce before firing. That sounds small in a changelog, but it was a floor under every load: even a three-node flow reported "ready" 120ms late, and anything you chained on those events — the initial fit, your own bootstrapping — inherited the delay.

v19.4 drops the wall clock. The pipeline now coalesces node registrations per microtask and settles within a paint or two, so synchronously populated flows get their load events about **120ms earlier**.

The safety the timer silently provided is now explicit instead of accidental: flows whose data arrives asynchronously no longer latch the one-shot events on an empty canvas, a render pass that lands mid-drag reruns right after pointer-up instead of being lost, and layer sorting skips the DOM entirely when the order is already settled — grouped graphs stop restarting CSS transitions on every pass.

## Fixes Worth Knowing About

**Reflow-on-resize stays alive.** Resizing a node by its top or left handle moves the node's position — and the resize handler never mirrored that back into the position model. From that moment the reflow orchestrator saw the node as mid-flight and silently skipped it in every later plan: the axis, delta-source, and runtime-config switches looked broken while the whole feature was dead for that node. The model now syncs on pointer-up, and position-changing resizes emit `fNodePositionChange` like drags always did.

**SSR stops crashing.** `*fVirtualFor` ([#340](https://github.com/Foblex/f-flow/issues/340)) and `<f-minimap>` ([#341](https://github.com/Foblex/f-flow/issues/341)) both called `requestAnimationFrame` on the server, where it does not exist. The virtual directive now renders everything synchronously on the server — SSR wants the full HTML in one pass anyway — and the minimap guards its subscription for the browser.

**Connection intersections tell the truth.** A node dropped over a connection it completely covers now counts as intersecting it, so `fNodeIntersectedWithConnections` fires; corner radii larger than the rect sides are clamped CSS-style instead of producing phantom intersections; and the per-pointer-move checks stopped re-parsing geometry they already had.

**Community fixes.** Destroyed `[fExternalItem]` palettes no longer leak their views through the root service — reported by [@arunraja92](https://github.com/arunraja92) ([#335](https://github.com/Foblex/f-flow/issues/335)). A node wrapped by its component's host element warns with the new `FF1012` diagnostic instead of breaking the drag — reported by [@i3ene](https://github.com/i3ene) ([#337](https://github.com/Foblex/f-flow/issues/337)). The external-item drag preview stays under the pointer on a scrolled page — fixed by [@itaishopen-unyx](https://github.com/itaishopen-unyx) ([#339](https://github.com/Foblex/f-flow/pull/339)). Thank you all.

And one honesty fix: `getPositionInFlow()` is now typed as returning `IPoint`. It never returned a rect — the old `IRect` type handed you `width` and `height` that were always `undefined`.

## Migration Notes

Nothing breaks. For the dependency change:

```bash
ng update @foblex/flow
```

rewrites every `@foblex/platform`, `@foblex/mediator`, `@foblex/utils`, and `@foblex/2d` import in your application to `@foblex/flow` and removes the packages from your `package.json`.

Doing it by hand instead: change the imports, drop the four packages. The geometry types are first-class exports; the mediator and utils symbols are deprecated re-exports that last until v20.

If you use `@foblex/flow-dagre-layout` or `@foblex/flow-elk-layout`, update them together with the library — they now require `@foblex/flow` 19.4 or newer.

## What This Means for Angular Teams

- One package to install, audit, and upgrade — the dependency tree below the library is Angular and nothing else.
- First paint can be the correct paint: no viewport jump on load.
- "Ready" means ready: load events fire when the render settles, not 120ms later.
- SSR and prerender work with virtualized nodes and the minimap on the page.
- Reflow-on-resize behaves the same whichever handle the user grabs.

## Closing

For me, the big takeaway from v19.4 is not any one feature in isolation. It is that the library got simpler to adopt while getting harder to misuse: fewer packages, fewer timing surprises, fewer silent failure modes.

The boundary stays where it was. The library owns the rendering and the gestures; your application owns the data and the business logic. Vendoring the toolkit underneath changed nothing about that line — it just removed four package.json entries between you and it.

If you're building a visual editor in Angular and want a native Angular solution (not a React wrapper) — take a look.

⭐ If Foblex Flow is useful to you, star the repo: it genuinely helps the project.

## ✅ Release Links

- Release: [https://github.com/Foblex/f-flow/releases/tag/v19.4.0](https://github.com/Foblex/f-flow/releases/tag/v19.4.0)
- Initial View demo: [https://flow.foblex.com/examples/initial-view](https://flow.foblex.com/examples/initial-view)
- Changelog: [https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md](https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md)
- Documentation: [https://flow.foblex.com/docs/get-started](https://flow.foblex.com/docs/get-started)
