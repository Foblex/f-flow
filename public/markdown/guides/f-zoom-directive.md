# Zoom

**Selector:** `f-canvas[fZoom]`  
**Class:** `FZoomDirective`

`FZoomDirective` adds wheel, double-click, and **pinch-to-zoom** (multitouch) capabilities, and exposes a small imperative zoom API.

## Why / Use cases

Use `fZoom` when your diagram can exceed viewport size and users need fast navigation.

Typical use cases:

- Large node graphs where pan-only navigation is slow.
- Editors that provide toolbar zoom buttons.
- UX with custom wheel/double-click trigger rules.
- Mobile/touch capabilities with pinch-to-zoom.

Skip zoom in constrained UIs where a fixed 1:1 scale is required.

## How it works

The directive registers as a plugin, conditionally attaches wheel/dblclick listeners when `fZoom` is enabled, and delegates scale changes to canvas transform commands.

**Pinch to Zoom:**  
When used in conjunction with [`fDraggable`](f-draggable-directive), `fZoom` automatically enables pinch-to-zoom gestures on touch devices. The zoom level is constrained by `fZoomMinimum` and `fZoomMaximum`.

## API

### Inputs

- `fZoom: boolean;` Default: `false`. Enables/disables zoom functionality.
- `fWheelTrigger: FEventTrigger;` Default: `Always`. Predicate for mouse wheel zoom.
- `fDblClickTrigger: FEventTrigger;` Default: `Always`. Predicate for double-click zoom.
- `fZoomMinimum: number;` Default: `0.1`. Minimum zoom scale.
- `fZoomMaximum: number;` Default: `4`. Maximum zoom scale.
- `fZoomStep: number;` Default: `0.1`. Zoom step for wheel interaction.
- `fZoomDblClickStep: number;` Default: `0.5`. Zoom step for double-click interaction.

### Outputs

- No outputs.

### Methods

- `zoomIn(position?: IPoint): void;` Zooms in, optionally centering on a specific position.
- `zoomOut(position?: IPoint): void;` Zooms out, optionally centering on a specific position.
- `setZoom(position: IPoint, step: number, direction: EFZoomDirection, animated: boolean): void;` Sets zoom level manually.
- `reset(): void;` Resets zoom to default (1) and centers the flow.
- `getZoomValue(): number;` Returns current zoom scale.

### Types

#### EFZoomDirection

```typescript
enum EFZoomDirection {
  ZOOM_IN = 0,
  ZOOM_OUT = 1,
}
```

## Styling

- `.f-component` Base class for flow primitives.
- `.f-zoom` Host class for the directive.

## Notes / Pitfalls

- `fZoom` only works on `f-canvas` under a valid `f-flow`.
- **Pinch-to-zoom** requires the flow to be `fDraggable`.
- If your flow contains locked UI zones (`[fLockedContext]`), wheel/dblclick zoom intentionally ignores them.
- Very small `fZoomStep` can make wheel zoom feel unresponsive.

## Example

::: ng-component <zoom></zoom> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/zoom/zoom.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/zoom/zoom.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/zoom/zoom.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
