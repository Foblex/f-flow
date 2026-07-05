# Accessibility

**Provider:** `provideFFlow(withA11y(...))`  
**Events:** `(fDeleteSelected)`, `(fMoveNodes)`, `(fCreateConnection)`

Every flow ships with two accessibility layers. The SEMANTIC layer is always on and needs no setup: it describes the graph to assistive technology. The KEYBOARD layer is opt-in — installing `withA11y()` makes the whole editor operable without a mouse, including creating connections entirely from the keyboard.

## Why / Use cases

- WCAG compliance: keyboard operability (2.1.1), status announcements (4.1.3), name/role/value on items (4.1.2) — the requirements a diagram editor usually fails first.
- Keyboard-first power users: selecting, moving and wiring nodes without leaving the keyboard.
- Screen-reader users: the graph topology is readable (each connection has an accessible name), and every action is announced through a live region.
- Read-only viewers: even without the keyboard layer, a rendered diagram is no longer silent for assistive technology.

## Semantics layer (always on)

Applied automatically as items register; an attribute you set yourself is **never overridden**:

- Nodes and groups get `role="group"` and an `aria-roledescription` ("node" / "group"). Their accessible name comes from your content — set `aria-label` on the element for an explicit one.
- Connections get `role="group"`, `aria-roledescription="connection"` and a generated `aria-label` — "Connection from A to B" — that tracks endpoint changes. A label you set yourself stays untouched.
- Items receive a DOM `id` when they have none (needed for `aria-activedescendant`).
- The minimap and the connection previews (`f-connection-for-create`, `f-snap-connection`) are `aria-hidden` — they are visual helpers, not content.
- A visually-hidden live region announces selection, movement, connection and deletion (WCAG 4.1.3). It is created once per flow and auto-clears.

## Keyboard layer (opt-in)

```typescript
import { provideFFlow, withA11y } from '@foblex/flow';

@Component({
  providers: [provideFFlow(withA11y())],
})
export class MyFlow {}
```

With the feature installed, the `f-flow` host becomes the single tab stop (`tabindex="0"`, `role="application"`, keyboard instructions attached via `aria-describedby`). DOM focus never moves to the items — arrows drive the SELECTION directly, and the active item is exposed to assistive technology through `aria-activedescendant`. The selected style is the only visual state; the host's own focus ring is transparent (it is repainted by Windows High Contrast, so forced-colors users keep an indicator).

Keyboard map:

- `Tab` — enters the flow; `Tab` again leaves it. Clicking inside the flow also activates the keyboard layer from the clicked item.
- Arrow keys — move the selection to the nearest item in that direction. Navigation is spatial (edge-based, so wide and tall nodes resolve correctly) and travels over nodes AND connections — walking a chain reads node → connection → node. The opposite arrow returns to where you came from.
- `Shift` + arrow — extends the selection instead of replacing it.
- `Ctrl`/`Cmd` + arrow — topology walk: the connection leading that way is selected first, the next press lands on the node at its other end.
- `Home` / `End` — first / last node.
- `Ctrl`/`Cmd` + `A` — select all; `Escape` — clear the selection (or cancel the active mode).
- `Space` — move the selection: hold it and use arrows (release to drop), or tap to grab and tap again to drop — the second form is for users who cannot hold two keys at once. `Shift` + arrow moves in coarse steps; `Escape` reverts. The drop emits `fMoveNodes` with every moved node; a pointer drag and a keyboard move produce the same event.
- `C` — start a connection. Requires exactly one selected node; the proposal defaults to the nearest connector on another node that is not already connected to the source. Arrows move between connectable targets spatially with the usual preview and snapping, `Enter` emits `fCreateConnection`, `Escape` cancels. Connection rules (`fConnectorDisabled`, `fCanBeConnectedTo`, categories, multiplicity) apply exactly as in the drag gesture.
- `Delete` / `Backspace` — emits `fDeleteSelected: FDeleteSelectedEvent` (`nodeIds`, `groupIds`, `connectionIds`). The library never mutates the graph — remove the items from your data and the flow follows. Requires `fDraggable`.
- `+` / `-` / `0` — zoom in, out and reset (when `fZoom` is present); the level is announced.

Behavior notes:

- Native interactive content inside nodes — `input`, `textarea`, `select`, `button`, links, `[contenteditable]`, and anything with a non-negative `tabindex` — is never hijacked: keys typed there stay typing, and clicking such content does not steal its focus.
- Single-character keys yield to OS shortcuts: `Ctrl`/`Cmd`+`C` stays copy.
- Groups are not arrow-navigation stops (their bounding rect would swallow the navigation); they stay pointer-reachable.
- `fSelectionDisabled` nodes are skipped by navigation; `fDraggingDisabled` nodes cannot be grabbed.
- If an item disappears from your data mid-mode (collaboration, refresh), the mode drops it and cancels itself when nothing is left.

## Configuration

```typescript
provideFFlow(
  withA11y({
    moveStep: 20,          // arrow step in canvas units (default 10)
    coarseMoveStep: 100,   // Shift+arrow step (default 50)
    keys: {
      connect: ['n'],      // rebind an action
      deleteSelected: [],  // empty array disables it
    },
    messages: {
      grabbed: (label) => `${label} взят. Стрелки — перемещение`,
    },
  }),
)
```

- `keyboard: false` — keeps the keyboard layer off while still customizing messages.
- `moveStep` / `coarseMoveStep` — the arrow and `Shift`+arrow movement steps in canvas units.
- `keys: IFA11yKeys` — bindings per action: `grab`, `connect`, `deleteSelected`, `selectAll` (always with `Ctrl`/`Cmd`), `zoomIn`, `zoomOut`, `zoomReset`. Values are `KeyboardEvent.key` strings; single characters match case-insensitively; an empty array disables the action. Arrows, `Enter` and `Escape` are structural and stay fixed.
- `messages: Partial<IFA11yMessages>` — every announcement and attached string as a keyed catalog (plain strings and functions), for localization or rewording. The defaults are exported as `F_DEFAULT_A11Y_MESSAGES`.

## Example

See the [Accessibility example](./examples/accessibility) for a working editor with the full keyboard map, custom `moveStep`, and the delete/move/connect events wired to signals.
