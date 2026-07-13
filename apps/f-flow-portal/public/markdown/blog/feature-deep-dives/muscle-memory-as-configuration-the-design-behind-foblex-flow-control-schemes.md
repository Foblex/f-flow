---
publishedAt: "2026-07-05"
updatedAt: "2026-07-13"
---

# Muscle Memory as Configuration: The Design Behind Foblex Flow Control Schemes

This article explains the thinking behind `withControlScheme(...)` in Foblex Flow v19 — why gesture mapping became one provided object instead of scattered trigger inputs, what a scheme actually controls, and where its boundary deliberately stops.

Every canvas tool trains its users' hands. Miro users scroll to pan and drag on empty space to select. draw.io users expect the wheel to zoom and the middle button to pan. Figma hands pan to `Space`+drag. None of these mappings is right — they are just _learned_. And when your Angular editor picks a different one, users don't file a feature request; they just feel that the tool is fighting them.

Before v19, changing the mapping in Foblex Flow meant a problem in three parts:

- Gesture triggers lived on three directives — `fDraggable`, `fZoom`, `f-selection-area` — each configured separately.
- The triggers had to agree with each other. Scroll-to-pan without `Ctrl`+wheel zoom leaves zoom unreachable; drag-to-select without another pan gesture leaves the canvas stuck.
- Some behavior was not reachable through triggers at all — the wheel's pan-vs-zoom split, the middle button's role.

You could get close. You could not get consistent.

## 🎯 The Key Idea: The Mapping Is One Object

A control scheme is the complete gesture-to-action mapping, provided once:

```ts
import { provideFFlow, withControlScheme, F_SCROLL_PAN_CONTROL_SCHEME } from '@foblex/flow';

@Component({
  providers: [provideFFlow(withControlScheme(F_SCROLL_PAN_CONTROL_SCHEME))],
})
export class MyFlow {}
```

One `IFControlScheme` object answers every input question the editor asks: what moves nodes, what pans the canvas, what starts the selection rectangle, what creates and reassigns connections, what resizes and rotates, and what the wheel does — pan or zoom. The interaction directives read the active scheme from a shared controller; you stop configuring three surfaces and start declaring one policy.

Three presets encode the muscle memory people bring:

- `F_DEFAULT_CONTROL_SCHEME` — the classic: drag pans, wheel zooms, `Shift`+drag selects. Applied when the feature is absent, so existing apps change nothing.
- `F_SCROLL_PAN_CONTROL_SCHEME` — Miro-like: scroll pans, `Ctrl`/`Cmd`+scroll or pinch zooms, drag on empty canvas selects, middle-drag pans.
- `F_DRAG_SELECT_CONTROL_SCHEME` — draw.io-like: wheel zooms, drag on empty canvas selects, middle-drag pans.

> 📌 In short: a scheme is a policy object. The presets are borrowed muscle memory; a custom scheme is yours.

## ⚡ Runtime Switching and the Precedence Rule

`FControlSchemeController` switches or tweaks the scheme at runtime — `setScheme(...)` takes a full preset or a partial override. That makes a user-facing "controls" setting a dropdown and three lines of code, which is exactly how tools like Miro expose it.

Precedence is one rule, applied everywhere: **an explicitly set trigger input wins over the active scheme, and the scheme wins over the built-in default.** Your existing `[fNodeMoveTrigger]` bindings keep working untouched; the scheme only fills what you didn't set. There is no second configuration system to learn — the old inputs became the override layer of the new one.

Two details show why the mapping had to be one object rather than per-directive settings:

- The wheel is a contested resource. `scrollPan` reassigns plain wheel to panning while `Ctrl`/`Cmd`+wheel and trackpad pinch keep zooming — a split that only makes sense decided in one place.
- The middle mouse button joins the drag pipeline **only** when the scheme's `canvasMove` gesture claims it. Without a scheme it stays inert, as it always was. A button's meaning is part of the policy, not a hardcode.

::: ng-component <control-schemes></control-schemes> [height]="600"
:::

Switch the scheme in the toolbar and watch the same canvas obey different hands.

## 🛠 Where the Boundary Stops

A scheme maps gestures to the editor's built-in actions. It deliberately does **not**:

- invent new actions — that is what connection flows and the interaction APIs are for;
- own the keyboard — keyboard operation is the accessibility layer's job (`withA11y()`), with its own remappable bindings;
- touch your application-owned data in the default stateless mode — gestures end in the same events (`fMoveNodes`, `fCreateConnection`, `fSelectionChange`) your app already handles. The library maps inputs; your application still owns what they mean. If [Managed Flow State](https://flow.foblex.com/examples/state) is enabled, its separate controller may apply supported finished gestures to the opt-in store.

Helpers for custom schemes ship as plain functions — `primaryButtonEventTrigger`, `middleButtonEventTrigger`, `isOnFlowBackground` — because a custom scheme should read like a policy, not like event-handling code.

## 🚀 Conclusion

The control scheme feature is small on the surface — one provider call — but it changes who decides how the editor feels. Before v19 that decision was baked into the library. Now it belongs to you, and through a settings dropdown, to your users.

- Guide: <https://flow.foblex.com/docs/control-scheme>
- Live example: <https://flow.foblex.com/examples/control-schemes>
- The release it shipped in: <https://flow.foblex.com/blog/foblex-flow-v19-0-0-control-schemes-click-to-connect-keyboard-accessibility-and-a-unified-connector-model>

If you're building a visual editor in Angular and want a native Angular solution (not a React wrapper) — take a look.

And if you like what I'm building, please consider starring the repo ⭐

It helps the project a lot.
