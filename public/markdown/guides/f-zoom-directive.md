# Zoom

## Description

`FZoomDirective` adds wheel/double-click zoom and exposes a small imperative zoom API.

- **Selector:** `f-canvas[fZoom]`
- **Class:** `FZoomDirective`

**What you get**

- Mouse wheel and double-click zoom handlers.
- Configurable min/max/step limits.
- Programmatic zoom control (`zoomIn`, `zoomOut`, `setZoom`, `reset`).

## Why / Use cases

Use `fZoom` when your diagram can exceed viewport size and users need fast navigation.

Typical use cases:

- Large node graphs where pan-only navigation is slow.
- Editors that provide toolbar zoom buttons.
- UX with custom wheel/double-click trigger rules.

Skip zoom in constrained UIs where a fixed 1:1 scale is required.

## How it works

The directive registers as a plugin, conditionally attaches wheel/dblclick listeners when `fZoom` is enabled, and delegates scale changes to canvas transform commands.

## Configuration (Inputs/Outputs/Methods)

### Inputs

- `fZoom: InputSignal<boolean>;` Enables/disables listeners.
- `fWheelTrigger: FEventTrigger;` Wheel trigger predicate.
- `fDblClickTrigger: FEventTrigger;` Double-click trigger predicate.
- `fZoomMinimum: number;` Default: `0.1`.
- `fZoomMaximum: number;` Default: `4`.
- `fZoomStep: number;` Default: `0.1`.
- `fZoomDblClickStep: number;` Default: `0.5`.

### Outputs

- No outputs.

### Methods

- `setZoom(position: IPoint, step: number, direction: EFZoomDirection, animated: boolean): void;`
- `getZoomValue(): number;`
- `zoomIn(position?: IPoint): void;`
- `zoomOut(position?: IPoint): void;`
- `reset(): void;`

## Styling

- `.f-component` Base class for flow primitives.
- `.f-zoom` Host class for the directive.

## Notes / Pitfalls

- `fZoom` only works on `f-canvas` under a valid `f-flow`.
- If your flow contains locked UI zones (`[fLockedContext]`), wheel/dblclick zoom intentionally ignores them.
- Very small `fZoomStep` can make wheel zoom feel unresponsive.

## Example

::: ng-component <zoom></zoom> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/zoom/zoom.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/zoom/zoom.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/zoom/zoom.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
