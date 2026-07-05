---
toc: false
wideContent: true
publishedAt: "2026-07-04"
updatedAt: "2026-07-05"
---

# Accessibility

## Description

Every flow ships with an accessibility layer. Semantics are always on: nodes, groups and connections get roles and accessible names (a connection reads "Connection from A to B" and the name tracks endpoint changes), selection and edits are announced through a visually-hidden live region, and helper visuals (minimap, connection previews) are hidden from screen readers. Attributes you set yourself are never overridden.

The keyboard layer is opt-in — add `provideFFlow(withA11y())` and the editor becomes fully operable without a mouse, including creating connections entirely from the keyboard. DOM focus never leaves the flow itself: arrows drive the selection directly (the active item is exposed to assistive technology via `aria-activedescendant`), so there is no separate focus state to learn and the selected style stays the only visual state.

## Example

This example enables the keyboard layer with a custom movement step and wires all three editing events to signals: `(fMoveNodes)` persists positions after a drop, `(fCreateConnection)` adds the wire, `(fDeleteSelected)` removes the selected items — the library never mutates the graph itself.

::: ng-component <accessibility></accessibility> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/accessibility/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/accessibility/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/accessibility/example.scss
:::

## Keyboard map

- `Tab` — enters the flow (the host is the single tab stop); `Tab` again leaves it. A click inside the flow also activates the keyboard layer from the clicked item.
- Arrow keys — move the selection to the nearest item in that direction. Navigation is spatial (edge-based, so wide and tall nodes resolve correctly) and travels over nodes AND connections — walking a chain reads node → connection → node; the opposite arrow returns to where you came from.
- `Shift` + arrow — extends the selection instead of replacing it; `Home` / `End` — first / last node.
- `Ctrl`/`Cmd` + arrow — topology walk: the connection leading that way is selected first, the next press lands on the node at its other end.
- `Ctrl`/`Cmd` + `A` — select all; `Escape` — clear the selection or cancel the active mode.
- `Space` — move the selection (a pointer drag and a keyboard move emit the same `fMoveNodes`): hold it and use arrows, release to drop; or tap to grab and tap again to drop — for users who cannot hold two keys at once. `Shift` + arrow moves in coarse steps, `Escape` reverts.
- `C` — start a connection; requires exactly one selected node. The proposal defaults to the nearest connector on another node that is not already connected to the source; arrows move between targets spatially with the usual preview and snapping, `Enter` emits `fCreateConnection`, `Escape` cancels. All connection rules (`fConnectorDisabled`, `fCanBeConnectedTo`, categories, multiplicity) apply exactly as in the drag gesture.
- `Delete` / `Backspace` — emits `fDeleteSelected` with the selected `nodeIds`/`groupIds`/`connectionIds`; removing them from your data is up to you, as always.
- `+` / `-` / `0` — zoom in, out, and reset, with the level announced.

Typing is never hijacked: keys pressed inside `input`, `textarea`, `select`, buttons, links, `[contenteditable]` or any focusable custom widget stay where they belong, and single-character shortcuts yield to OS combos (`Ctrl`/`Cmd`+`C` stays copy).

## Usage

Semantics need no setup. The keyboard layer turns on with the feature:

```typescript
import { provideFFlow, withA11y } from '@foblex/flow';

@Component({
  providers: [
    provideFFlow(
      withA11y({
        moveStep: 20,
        keys: { connect: ['n'], deleteSelected: [] },
        messages: { grabbed: (label) => `${label} grabbed` },
      }),
    ),
  ],
})
export class MyFlow {}
```

- `keyboard: false` — keeps the keyboard layer off while still customizing messages/semantics.
- `moveStep` / `coarseMoveStep` — the arrow and `Shift`+arrow movement steps in canvas units.
- `keys` — key bindings per action (`grab`, `connect`, `deleteSelected`, `selectAll`, `zoomIn`, `zoomOut`, `zoomReset`) as `KeyboardEvent.key` values; an empty array disables the action. Arrows, `Enter` and `Escape` are fixed.
- `messages` — the full catalog of announcements and attached strings (`IFA11yMessages`), for localization or rewording; defaults are exported as `F_DEFAULT_A11Y_MESSAGES`.

Give nodes an accessible name with a plain `aria-label` — the library never overrides attributes you set yourself, it only fills the gaps:

```html
<div fNode [attr.aria-label]="node.label" [fNodePosition]="node.position"></div>
```

The full reference — semantics details, screen-reader behavior, and every configuration option — lives in the [Accessibility guide](./docs/accessibility).
