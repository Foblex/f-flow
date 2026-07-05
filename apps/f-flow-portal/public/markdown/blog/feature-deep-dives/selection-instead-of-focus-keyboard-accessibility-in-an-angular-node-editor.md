---
publishedAt: "2026-07-05"
updatedAt: "2026-07-05"
---

# Selection Instead of Focus: Keyboard Accessibility in an Angular Node Editor

This article explains the design decisions behind the Foblex Flow accessibility layer — why keyboard navigation drives the selection instead of a focus cursor, how a canvas full of absolutely-positioned nodes becomes readable to a screen reader, and why creating a connection from the keyboard turned out to be the easy part.

If you try to make a node editor accessible, you'll quickly face a problem:

- A canvas is not a list. Tab order means nothing when items live at arbitrary coordinates.
- Drag-and-drop is the primary editing gesture, and there is no native keyboard equivalent for "drag from this port to that port".
- Screen readers see an SVG soup: paths without names, divs without roles, changes without announcements.
- Every attempt to bolt a "keyboard focus" state onto an editor that already has a selection state doubles the mental model.

That last one is the interesting problem, and it is the one this article is really about.

## 🎯 The Key Idea: One State, Not Two

Most UI accessibility patterns assume a roving focus: arrow keys move `document.activeElement` from item to item, and selection is a separate thing you do to the focused item with `Space` or `Enter`.

I tried that first. And threw it away.

On a canvas it produces two competing highlights — the focus ring on one node, the selection style on another — and everyone gets confused, sighted users included. Worse, moving DOM focus into consumer-rendered nodes has side effects the library cannot predict: `focusin` handlers fire in your templates, `:focus-within` styles trigger, screen readers start reading node internals mid-navigation.

What shipped in v19 is the opposite arrangement:

- DOM focus stays on the `f-flow` host — permanently. It is the single tab stop.
- Arrow keys move the **selection** directly, exactly like a pointer click would.
- The active item is exposed to assistive technology through `aria-activedescendant` on the host.
- The selected style is the only visual state. The host's own focus ring is transparent — invisible in normal themes, repainted by Windows High Contrast so forced-colors users keep an indicator.

> 📌 In short: there is no keyboard focus state to learn. There is only selection, and the keyboard drives it.

This is the second canonical ARIA pattern (`aria-activedescendant` composite widgets) rather than the first (roving tabindex), and for a canvas it is the right one: no focus jumps, no consumer-template side effects, no double speech.

## ⚡ Navigation That Understands Geometry

Arrow keys need an answer to "what is to the right of this node?" — and centers are the wrong way to compute it. A tall node whose center is far below still starts right next to you; a wide neighbor in the same row should win over a nearer one two rows down.

The spatial algorithm works on **edges**: a candidate qualifies when it lies ahead of the current item in the pressed direction, and it is scored by the gap between facing edges plus a doubled penalty for leaving the current row or column. The nearest diagonal neighbor beats a far straight one — on a sparse canvas, strict "straight sector first" logic (the TV-remote model) jumps across the whole graph, and that is not what a hand on the arrow keys expects.

Two more decisions matter here:

- Navigation travels over nodes **and** connections. A connection is a stop at its midpoint, so walking a chain reads node → connection → node, and a selected connection can be deleted like anything else.
- The opposite arrow returns to where you came from, even when geometry would prefer a different neighbor. Going right and then left should be a round trip.

`Ctrl`+arrow adds the graph-native move: follow the connection in that direction to the node on its other end. Geometry navigation answers "what is near me"; topology navigation answers "what am I wired to".

## 🔧 Moving and Connecting Without a Mouse

Movement uses a grab pattern with two entry styles. Hold `Space` and use arrows — release to drop. Or tap `Space` to grab and tap again to drop. The second form exists because holding one key while pressing another is a chord, and chords are exactly what some motor-impaired users cannot do. Both forms move the whole selection — the same set a pointer drag would move — and emit the same `fMoveNodes` event on drop. `Escape` puts everything back.

Creating a connection is where the v19 architecture paid off. The click-to-connect feature shipped earlier in this release extracted a gesture-independent engine — `FCreateConnectionSession` — that owns the preview line, snapping, connectable marking, target resolution, and the `fCreateConnection` emission. The keyboard flow is just a third gesture on that engine:

- `C` starts a session from the selected node (exactly one node must be selected — anything else would guess the source silently).
- The proposed target defaults to the nearest connector on **another** node that is **not already connected** to the source.
- Arrows move between candidate targets spatially, with the same preview and snap highlight the drag gesture shows.
- `Enter` emits `fCreateConnection`. `Escape` cancels.

Every connection rule — disabled connectors, categories, `fCanBeConnectedTo`, multiplicity — applies unchanged, because it is the same engine the pointer uses.

The golden rule of Foblex Flow did not move an inch: the library **never mutates your data**. `Delete` emits `fDeleteSelected` with the selected ids. This happened. You decide what to do.

## 🛠 What Runs by Default, and What Doesn't

The layer is split deliberately:

1. **Semantics are always on.** Roles, accessible names ("Connection from A to B", tracking endpoint changes), a live region announcing selection, movement, connection and deletion, `aria-hidden` on the minimap and previews. These are inert attributes — and any attribute you set yourself is never overridden.
2. **The keyboard layer is opt-in** via `provideFFlow(withA11y())`. Every f-flow app older than v19 has its own key handling, because the library had none. A default-on layer would double-drive selection and deletion in all of them. So it doesn't.
3. **Typing is never hijacked.** Keys pressed inside inputs, textareas, selects, buttons, links, `contenteditable` or any focusable custom widget stay where they belong. Single-character shortcuts yield to OS combos — `Ctrl`+`C` stays copy.
4. **Everything is configurable.** Movement steps, per-action key bindings (an empty array disables an action), and a fully localizable message catalog — announcements are speech, and speech has a language.

::: ng-component <accessibility></accessibility> [height]="600"
:::

Click the canvas or Tab to it, then: arrows to select, `Shift`+arrow to extend, `Ctrl`+arrow to follow a connection, `Space` to move, `C` → `Enter` to connect, `Delete` to remove.

## 🚀 Conclusion

The accessibility layer is not a separate mode bolted onto the editor. It is the same selection model, the same events, and the same connection engine the pointer uses — driven by different keys. That is why it took a redesign to get right, and why the result feels like the editor, not like an add-on.

- Full keyboard map and configuration: <https://flow.foblex.com/docs/accessibility>
- Live example: <https://flow.foblex.com/examples/accessibility>
- The release it shipped in: <https://flow.foblex.com/blog/foblex-flow-v19-0-0-control-schemes-click-to-connect-keyboard-accessibility-and-a-unified-connector-model>

If you're building a visual editor in Angular and want a native Angular solution (not a React wrapper) — take a look.

And if you like what I'm building, please consider starring the repo ⭐

It helps the project a lot.
