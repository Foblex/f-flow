# Control Scheme

**Provider:** `provideFFlow(withControlScheme(...))`  
**Controller:** `FControlSchemeController`

A control scheme is the complete mapping between input gestures and canvas actions: which button pans, what the wheel does, how selection starts. One provided object drives `fDraggable`, `fZoom` and `f-selection-area` together instead of configuring their triggers one by one.

## Why / Use cases

Use a control scheme when your editor should feel like a specific tool family or let users pick their own navigation style.

Typical use cases:

- Miro/Figma-style navigation: scroll pans, `Ctrl`/`Cmd`+scroll or pinch zooms, drag on empty canvas selects.
- draw.io-style navigation: wheel zooms, drag on empty canvas selects, middle-mouse drag pans.
- A user-facing "controls" setting that switches gesture mappings at runtime.

Skip the feature when the default behavior (drag pans, wheel zooms, `Shift`+drag selects) fits your app — it applies without any setup.

## How it works

`withControlScheme(...)` binds the resolved scheme to an injection token and provides `FControlSchemeController` at the component that calls `provideFFlow(...)`. The interaction directives read the active scheme through the controller; without the feature they fall back to `F_DEFAULT_CONTROL_SCHEME`. Per-instance trigger inputs (`fNodeMoveTrigger`, `fWheelTrigger`, `fTrigger`, …) override the scheme when set.

The middle mouse button reaches the drag pipeline only when the active scheme's `canvasMove` gesture accepts it, so with the default scheme a middle-drag stays inert.

```typescript
import { provideFFlow, withControlScheme, F_SCROLL_PAN_CONTROL_SCHEME } from '@foblex/flow';

@Component({
  providers: [provideFFlow(withControlScheme(F_SCROLL_PAN_CONTROL_SCHEME))],
})
export class MyFlow {
  private readonly _controlScheme = inject(FControlSchemeController);

  switchToDefault(): void {
    this._controlScheme.setScheme(F_DEFAULT_CONTROL_SCHEME);
  }
}
```

## API

### IFControlScheme

Every gesture is an `FEventTrigger` predicate `(event: MouseEvent | TouchEvent | WheelEvent) => boolean` evaluated when the interaction is about to start.

- `nodeMove: FEventTrigger;` Starts dragging a node.
- `canvasMove: FEventTrigger;` Starts panning the canvas by dragging; also decides whether the middle mouse button participates.
- `selection: FEventTrigger;` Activates the `f-selection-area` rectangle.
- `createConnection: FEventTrigger;` Starts creating a connection from a connector.
- `reassignConnection: FEventTrigger;` Starts reassigning an existing connection endpoint.
- `nodeResize: FEventTrigger;` Starts resizing a node from a resize handle.
- `nodeRotate: FEventTrigger;` Starts rotating a node from a rotate handle.
- `scrollPan: boolean;` When `true`, a plain wheel / two-finger scroll pans and `Ctrl`/`Cmd`+wheel or pinch zooms.
- `zoom: FEventTrigger;` Gates wheel zoom (applies while `scrollPan` is off, or with `Ctrl`/`Cmd`).

Multi-select, double-click zoom, external items and connection waypoints stay on their dedicated inputs and are not part of the scheme.

### Presets

- `F_DEFAULT_CONTROL_SCHEME` — drag pans, wheel zooms, `Shift`+drag selects. Applied when the feature is absent.
- `F_SCROLL_PAN_CONTROL_SCHEME` — Miro-like: scroll pans, `Ctrl`/`Cmd`+scroll or pinch zooms, drag on empty canvas selects, middle-drag pans.
- `F_DRAG_SELECT_CONTROL_SCHEME` — draw.io-like: wheel zooms, drag on empty canvas selects, middle-drag pans.

### FControlSchemeController

- `scheme: Signal<IFControlScheme>;` The active scheme.
- `getScheme(): IFControlScheme;` Returns the active scheme.
- `setScheme(scheme: IFControlSchemeConfig): void;` Merges the given gestures over the current scheme; a full preset replaces it.

### Trigger helpers

- `primaryButtonEventTrigger` — passes for touch input and the primary (left) mouse button.
- `middleButtonEventTrigger` — passes while the middle (wheel) mouse button is pressed.
- `isOnFlowBackground(event)` — `true` when the event started over the empty canvas rather than a node, group or connection.

## Custom schemes

Pass a partial object to `withControlScheme(...)` — missing gestures fall back to the default scheme:

```typescript
provideFFlow(withControlScheme({ scrollPan: true }));
```

Or start from a preset and override individual gestures:

```typescript
import {
  F_SCROLL_PAN_CONTROL_SCHEME,
  isOnFlowBackground,
  withControlScheme,
} from '@foblex/flow';

// Scroll-pan navigation, but marquee-select only while Alt is held
provideFFlow(
  withControlScheme({
    ...F_SCROLL_PAN_CONTROL_SCHEME,
    selection: (event) => event.altKey && isOnFlowBackground(event),
  }),
);
```

Under a scheme that binds `selection` to a plain drag, clicking the empty canvas clears the selection and a marquee replaces it; `Shift`+drag keeps the current selection, so the marquee stays additive.

## Example

See the [Control Schemes example](./examples/control-schemes) for a runtime switch between the three presets.
