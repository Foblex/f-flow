---
publishedAt: "2026-09-28"
updatedAt: "2026-09-28"
---

# Foblex Flow v19.3.0: Strict CSP Support, Smarter Waypoint Routing, and New Diagnostics

Today I'm shipping **v19.3.0**. The headline is strict `Content-Security-Policy` support: component styles are no longer emulated, so a `style-src` built from hashes works without `'unsafe-inline'` — including on static hosting. And this release came from the community, from the first reports to the shipped code.

The release adds:

- **Strict CSP support** - unencapsulated, element-prefixed component styles that a hash-based `style-src` can allow.
- **Smarter waypoint routing** - segment, bezier, and adaptive connections pass through waypoints as real anchors, without stubs, kinks, or handles floating off the line.
- **Precision drops and reassigns** - node-level drops attach to the closest connector, and shared reassign handles prefer the selected connection.
- **Snap target events** - `<f-snap-connection>` emits `fSnapTargetChange`, so both endpoints can be styled while the snap preview is visible.
- **`fitToScreen` with a scale cap** - fitting a small graph no longer magnifies it to fill the viewport.
- **Two new diagnostics** - `FF1010` and `FF1011` turn silent app-side misconfigurations into one-shot dev warnings.
- **Connection worker cleanup** - the worker is terminated when its flow is destroyed.

There are no breaking changes in this release.

## Styles a Strict CSP Can Hash

Angular injects component styles at runtime as `<style>` elements. Under a strict `Content-Security-Policy`, every one of them must be allowed by `style-src` — and under emulated encapsulation that was practically impossible to do with hashes, because every rule is rewritten with generated scoping attributes:

```css
/* what the source says */
:host { position: absolute; }

/* what the browser receives */
[_nghost-ng-c2570364828] { position: absolute; }
```

Those attributes are an artifact of the build. Hash the style text today, and a refactor that changes component registration order can change it tomorrow — failing in production as silently unstyled components. Nonces avoid that, but need a server rendering HTML per response, which rules out static hosting.

v19.3 removes the blocker ([#329](https://github.com/Foblex/f-flow/issues/329)): all 14 styled components declare `ViewEncapsulation.None`, and every rule is written against the component's own element selector — `f-selection-area { … }` instead of `:host { … }`. The emitted CSS is byte-for-byte what's in the source. Hash it once:

```js
await Promise.all(
  [...document.querySelectorAll('style')].map(async (s) => {
    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(s.textContent),
    );
    return `'sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}'`;
  }),
);
```

```
Content-Security-Policy: style-src 'self' 'sha256-vCwY4Rft…' 'sha256-hbLZQvOX…'
```

We verified it the way an integrator would deploy it: a production build of this documentation site behind a real, enforced header. With a deliberately wrong hash the canvas visibly degrades — proof the policy is enforced. With the collected hashes, everything renders and a full drag-to-connect gesture works. Zero violations, zero `'unsafe-inline'`.

One scoping subtlety was caught in review: emulated encapsulation used to limit rules like `:host svg` to the component's **own template**, while an unscoped `f-connection svg` would also reach projected user content — custom `svg[fMarker]` markers and icons inside `[fConnectionContent]`. The shipped rules use the child combinator (`f-connection > svg`), which reproduces the old scoping exactly, and a regression spec pins that contract.

## Waypoints That Behave Like Anchors

Connection routing through waypoints is reworked ([#324](https://github.com/Foblex/f-flow/issues/324)). Before, a waypoint was treated too much like a connector: the router added connector-style stubs and extra bends around it, some paths missed a dragged waypoint entirely, and handles on rounded corners sat on the sharp corner point — visibly off the rendered line.

Now a waypoint is a pass-through anchor:

- Segment routes go through waypoints without stubs or extra bends, and prefer going **around** the endpoint nodes instead of through them.
- Bezier and adaptive curves pass through waypoints smoothly: both segments meeting at a waypoint share one tangent, so the curve no longer kinks toward the connector directions.
- Handles on rounded corners are drawn and hit-tested on the **bend apex** of the rendered path — the handle always sits on the visible line.

## Drops and Reassigns That Hit What You Aimed At

Two interaction fixes, both reported with StackBlitz reproductions:

- Dropping a connection on a node body (`fConnectOnNode`) used to attach to the node's **first registered** connector. It now attaches to the connector closest to the drop point ([#326](https://github.com/Foblex/f-flow/issues/326)).
- When several connections share a connector, their reassign handles coincide — and the grab went by registration order, ignoring the selection. The **selected** connection now wins the grab ([#328](https://github.com/Foblex/f-flow/discussions/328)).

Both sound small in a changelog, but they are exactly the kind of behavior users feel as "the editor does what I meant".

## Snap Target Events

`<f-snap-connection>` now emits `fSnapTargetChange` while a connection is being created ([#180](https://github.com/Foblex/f-flow/issues/180)):

```html
<f-snap-connection
  [fSnapThreshold]="50"
  (fSnapTargetChange)="onSnapTarget($event)"
></f-snap-connection>
```

The event carries `{ sourceId, targetId }`: one event when a connector enters the snap threshold or the snap switches to another connector, and one with `targetId: undefined` when the snap is released or the gesture ends. One event per change — not one per pointer move — so it is safe to drive endpoint styling from it directly.

## fitToScreen With a Scale Cap

`fitToScreen` accepts an optional `maxScale` argument ([#147](https://github.com/Foblex/f-flow/issues/147)):

```ts
// padding, animated, emitCanvasChange, maxScale
this.fCanvas.fitToScreen(PointExtensions.initialize(), true, true, 1);
```

With `maxScale: 1` a graph smaller than the viewport is centered at its natural size instead of being blown up to fill it. Larger graphs scale down to fit as before.

## Diagnostics That Point at the Cause

Two new dev-mode warnings joined the `FFxxxx` family — one-shot per cause, stripped from production builds, both born from real support issues:

- **FF1010 - connector element has no size.** The visible dot is drawn with `::before`/`::after` while the connector element itself is 0×0. Hit-testing uses the element's box, so drops land past the connector ([#326](https://github.com/Foblex/f-flow/issues/326)).
- **FF1011 - node is rendered away from its model position.** App CSS on the node host moved the visuals while `fNodePosition` stayed put, so model-driven features — the minimap, `fitToScreen`, auto-layout — disagree with what the canvas shows ([#331](https://github.com/Foblex/f-flow/issues/331)).

Both thresholds are configurable, `0` switches a check off:

```ts
provideFFlow({
  diagnostics: {
    minConnectorSize: 4, // FF1010, px; default 1
    maxNodePositionDrift: 5, // FF1011, on-screen px; default 2
  },
});
```

The full code list lives in the [errors and warnings guide](https://flow.foblex.com/docs/errors).

## The Connection Worker Shuts Down With Its Flow

Heavy connection redraws can run in a web worker. The worker state is provided per `f-flow` instance, but its `dispose()` had no caller: destroy a flow, and its worker thread and blob URL stayed alive ([#330](https://github.com/Foblex/f-flow/issues/330)).

For a single long-lived editor that is invisible. For an application that opens and closes editors — a dialog with a flow inside, a tab switcher, a router that recreates the page — it is a slow leak of threads.

Disposal is now wired into the flow's own teardown: `ngOnDestroy` terminates the worker, revokes its blob URL, and rejects in-flight requests. Each flow cleans up exactly what it created.

## ng add Writes Your Agent Rules

`ng add @foblex/flow` now also writes a canonical Foblex Flow instruction block to `AGENTS.md` and makes sure Claude Code loads it through an `@AGENTS.md` import in `CLAUDE.md` — idempotently, preserving whatever project instructions already exist.

Together with the version-matched `AI.md` shipped inside the npm package and the LLM-readable docs at [flow.foblex.com/llms.txt](https://flow.foblex.com/llms.txt), the goal is simple: an AI coding agent working in your repository should know how the library actually works — the same diagnostics, the same verification workflow, the same rules a human reads.

## A Community Release

This release belongs to the community:

- [chris-perry](https://github.com/chris-perry) - strict CSP support ([#329](https://github.com/Foblex/f-flow/issues/329)) and the connection worker cleanup ([#330](https://github.com/Foblex/f-flow/issues/330)).
- [dmarov](https://github.com/dmarov) - the waypoint routing, the closest-connector drop, and the selected-reassign behavior; co-author on those commits.
- [dja-dsd](https://github.com/dja-dsd) - the `fitToScreen` scale cap.
- [iocat](https://github.com/iocat) and [bstaley](https://github.com/bstaley) - the snap target event and its styling use case.
- [ShyamaMenon](https://github.com/ShyamaMenon) - the minimap behavior that became `FF1011`.

For me, this is the shape of open source I care about: people who use the library in real editors, care enough to make it better, and shape where it goes next.

## Upgrade Notes

- There are no breaking changes in v19.3.0.
- The documented CSS classes and the shipped SCSS theme are untouched by the encapsulation change.
- Library rules lost the specificity that emulated scoping attributes added. Application overrides that previously lost a specificity tie may now win — if you override library internals, a quick visual pass after upgrading is worth it.
- Projected content — custom `svg[fMarker]` markers, `[fConnectionContent]` — is not affected by library svg rules.
- If an upgrade ever failed with `ERESOLVE` on the layout packages: `@foblex/flow-dagre-layout` and `@foblex/flow-elk-layout` now declare the correct 19.x peer range.
- To adopt a strict CSP: build, collect the injected style hashes, and ship `style-src 'self' 'sha256-…'`. No nonce infrastructure required.

## Closing

This release has no single big feature, and that is the point: waypoints route like you drew them, drops land where you aimed, misconfigurations report themselves, and the library no longer stands between your application and a strict CSP. It is also the most community-driven release the project has had — which says more about where the project is than any feature could.

If you're building a visual editor in Angular and want a native Angular solution (not a React wrapper) — take a look.

And if you like what I'm building, please consider starring the repo ⭐

It helps the project a lot.

## Release Links

- Release: <https://github.com/Foblex/f-flow/releases/tag/v19.3.0>
- Changelog: <https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md>
- Snap connection example: <https://flow.foblex.com/examples/auto-snap>
- Errors and warnings guide: <https://flow.foblex.com/docs/errors>
- CSP issue: <https://github.com/Foblex/f-flow/issues/329>
- Worker issue: <https://github.com/Foblex/f-flow/issues/330>
