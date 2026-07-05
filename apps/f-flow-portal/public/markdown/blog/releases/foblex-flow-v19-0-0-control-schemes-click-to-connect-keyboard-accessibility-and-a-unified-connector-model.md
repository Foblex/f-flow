---
publishedAt: "2026-07-05"
updatedAt: "2026-07-05"
---

# Foblex Flow v19.0.0: Control Schemes, Click-to-Connect, Keyboard Accessibility, and a Unified Connector Model

Foblex Flow v19 opens up how an Angular node editor is driven: provider-based control schemes with Miro-like and draw.io-like presets, click-to-connect on a gesture-independent connection engine, an opt-in keyboard accessibility layer with screen-reader announcements, one unified connector directive, and an AI-ready toolchain.

Foblex Flow is an Angular library for building node-based editors: flows, diagrams, visual builders — all with a focus on interactive UX and clean APIs.

Today I'm shipping **v19.0.0**. It looks like a long changelog, but it is really one story: until now, there was exactly one way to drive a Foblex Flow editor — my way. One gesture mapping, one way to create connections, one input device. v19 opens that up. The pointer scheme, the connection gesture, the keyboard, even the AI agent writing code against the library — they are all first-class ways to drive the editor now.

## ✨ Short version

- **Control schemes** — `withControlScheme(...)` maps gestures to actions for the whole editor at once, with Miro-like and draw.io-like presets and runtime switching.
- **Connection flows** — `withConnectionFlow('click')` adds click-to-connect alongside drag, backed by a new gesture-independent connection engine you can build custom gestures on.
- **Accessibility** — ARIA semantics in every flow by default, plus an opt-in keyboard layer that can select, move, delete, and even create connections without a mouse.
- **Unified connector model** — one `[fConnector]` directive instead of the input/output/outlet trio, and `fSourceId`/`fTargetId` on connections.
- **An AI-ready toolchain** — dev-mode diagnostics with stable error codes, agent rules installed by `ng add`, and version-matched LLM docs shipped inside the npm package.

## Control Schemes

Different tools train different hands. Miro users scroll to pan and drag to select. draw.io users expect the wheel to zoom. Until now, Foblex Flow had one hardcoded answer, and making it behave differently meant configuring triggers on three directives separately and hoping they agree.

A control scheme is the complete mapping between input gestures and canvas actions, provided as one object:

```ts
import { provideFFlow, withControlScheme, F_SCROLL_PAN_CONTROL_SCHEME } from '@foblex/flow';

@Component({
  providers: [provideFFlow(withControlScheme(F_SCROLL_PAN_CONTROL_SCHEME))],
})
export class MyFlow {}
```

Three presets ship out of the box: the default (drag pans, wheel zooms, `Shift`+drag selects), a Miro-like scheme (scroll pans, `Ctrl`/`Cmd`+scroll or pinch zooms, drag on the empty canvas selects, middle-drag pans), and a draw.io-like scheme. `FControlSchemeController` switches or tweaks the scheme at runtime, so a user-facing "controls" setting is a few lines of code. The existing trigger inputs keep working and override the active scheme — nothing breaks.

This release also closes two long-standing viewport requests along the way: plain-wheel scrolling pans the canvas in scroll-pan schemes, and trackpad pinch gets its own zoom step.

✅ Live demo: https://flow.foblex.com/examples/control-schemes

## Click-to-Connect, and the Engine Behind It

The most requested interaction change: create a connection by clicking a source connector, watching the preview follow the cursor, and clicking a target — no click-and-hold.

```ts
providers: [provideFFlow(withConnectionFlow('click'))],
```

Drag-to-connect keeps working alongside. `Escape` or clicking elsewhere cancels; clicking another source re-arms from it.

The interesting part is underneath. Both gestures now drive the same **FCreateConnectionSession** — a gesture-independent engine that owns the preview line, snapping, connectable marking, target resolution, and the `fCreateConnection` emission. A custom gesture is a class with `initialize()` and `destroy()` that drives the session; validation and events come for free. The keyboard layer below is the proof that this works: it is just a third gesture on the same engine.

✅ Live demo: https://flow.foblex.com/examples/click-to-connect

## Accessibility

This is the part of v19 I spent the most iterations on, because the obvious design was wrong.

The obvious design is a separate keyboard "focus" state walking the nodes. I tried it and threw it away: two highlight states on one canvas confuse everyone, sighted or not. What shipped instead: DOM focus stays on the flow itself, and the arrow keys drive the **selection** directly — the same selection a pointer click produces. Assistive technology follows along through `aria-activedescendant`. One state, one visual, one mental model.

Semantics are always on and cost nothing: nodes, groups and connections get roles and accessible names ("Connection from A to B", tracking endpoint changes), a live region announces selection, movement, connection and deletion, and helper visuals are hidden from screen readers. Attributes you set yourself are never overridden.

The keyboard layer is **opt-in** — existing apps have their own key handling, and I'm not going to double-drive them:

```ts
providers: [provideFFlow(withA11y())],
```

With it on: arrows move the selection spatially over nodes _and_ connections, `Shift`+arrow extends, `Ctrl`+arrow walks the topology along connections, `Space` moves the selection (hold-and-release, or tap-to-grab for users who cannot hold two keys at once), `Delete` emits the new `fDeleteSelected` event, and `C` starts a connection from the selected node — arrows pick the target with the usual preview and snapping, `Enter` commits. Every string is localizable, every action key is remappable, and typing inside inputs in your nodes is never hijacked.

The golden rule did not move: the library **never mutates your data**. `Delete` tells you what the user wants removed. You decide what to do.

✅ Live demo: https://flow.foblex.com/examples/accessibility
📚 Guide: https://flow.foblex.com/docs/accessibility

## One Connector Instead of Three

The legacy connector API grew three directives — `fNodeInput`, `fNodeOutput`, `fNodeOutlet` — with three id namespaces and asymmetric options. v19 replaces the trio with one:

```html
<div fConnector fConnectorType="source" fConnectorId="out-1"></div>
```

One id per connector; `fConnectorType` decides the behavior (`source`, `target`, `source-target`, `outlet`). Connections get canonical `fSourceId`/`fTargetId` inputs. The legacy directives and `fOutputId`/`fInputId` keep working — deprecated, not removed — so migration is at your pace.

✅ Live demo: https://flow.foblex.com/examples/unified-connector

## The Editor Now Explains Itself — to Humans and to Agents

A silent failure is the worst kind of bug report, and node editors are full of them: a connection whose endpoint id matches nothing, a node inside a nested `@if` that registers but renders detached, a zero-height host. v19 ships dev-mode diagnostics with stable codes — **FF1001–FF1009** — each linking to a documented cause and fix at https://flow.foblex.com/docs/errors. They are stripped from production builds.

The same release makes the library legible to AI agents, because that is where the errors actually come from now. `ng add @foblex/flow` writes a managed section into your `AGENTS.md` pointing coding agents at the version-matched guide bundled **inside the npm package**, and the hosted `llms.txt`/`llms-full.txt` are validated in CI so they cannot drift from the API again. Details: https://flow.foblex.com/docs/ai

## Small Fixes That Matter

- A fast drag no longer lags or jumps: the drag anchors to the pointer-down position, not the threshold-crossing point.
- Safari no longer leaves ghost preview lines on the canvas after a drop.
- A native `<select>` opened inside a node no longer leaves the node glued to the cursor afterward — the swallowed `pointerup` is detected and the drag ends cleanly.

Each of these sounds small in a changelog, but they are exactly the kind of thing that decides whether an editor feels solid.

## Migration Notes

Nothing is removed in v19; the deprecations keep working.

- `fNodeInput` / `fNodeOutput` / `fNodeOutlet` → `[fConnector]` with `fConnectorType`. Legacy directives still work and are marked deprecated.
- `fOutputId` / `fInputId` (and `fOutputSide` / `fInputSide`) on `f-connection` → `fSourceId` / `fTargetId` (`fSourceSide` / `fTargetSide`). The new input wins when both are set.
- `fCanBeConnectedInputs` → `fCanBeConnectedTo`.
- `[fConnector]` defaults to `fConnectorMultiple = true`; legacy outputs were single-connection. Set it to `false` where you relied on that.
- Connector ids are unique across all connector types in the unified model.
- Every flow now applies inert ARIA attributes (roles, generated names, DOM ids where missing). Your own attributes always win; behavior changes only if you opt into `withA11y()`.
- If you subclass `FDraggableBase` directly (rare), it has two new abstract members: `fDeleteSelected` and `fCreateConnectionTrigger`.

## What This Means for Angular Teams

- Your editor can feel like Miro, like draw.io, or like your own tool — one provider, switchable at runtime.
- Connection creation is no longer welded to drag: click-to-connect ships, custom gestures are a small class.
- Keyboard operation and screen-reader support are one `withA11y()` away, with events that respect your ownership of the data.
- One connector directive, one connection id vocabulary, documented migration.
- Silent failures now come with error codes, and your coding agents get version-matched docs from the package they installed.

## Closing

For me, the big takeaway from v19 is not any one feature in isolation. The control scheme, the click gesture, the keyboard layer — each is a different answer to the same question: who decides how the editor is driven? Before v19 the answer was the library. Now it is you, and your users, whichever hands or tools they bring.

If you're building a visual editor in Angular and want a native Angular solution (not a React wrapper) — take a look.

And if you like what I'm building, please consider starring the repo ⭐

It helps the project a lot.

## ✅ Release links

- Release: https://github.com/Foblex/f-flow/releases/tag/v19.0.0
- Changelog: https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md
- Control schemes demo: https://flow.foblex.com/examples/control-schemes
- Click-to-connect demo: https://flow.foblex.com/examples/click-to-connect
- Accessibility demo: https://flow.foblex.com/examples/accessibility
- Unified connector demo: https://flow.foblex.com/examples/unified-connector
- Accessibility guide: https://flow.foblex.com/docs/accessibility
- Control scheme guide: https://flow.foblex.com/docs/control-scheme
- Error reference: https://flow.foblex.com/docs/errors
- AI agents guide: https://flow.foblex.com/docs/ai
