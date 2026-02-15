# Connection Marker

## Description

`FConnectionMarker` lets you define custom SVG markers for connection starts and ends.

- **Selector:** `svg[fMarker]`
- **Class:** `FConnectionMarker`

**What you get**

- Custom arrowheads, circles, diamonds, or any SVG marker shape.
- Separate marker definitions for normal and selected states.
- Full SVG control (`orient`, `markerUnits`, `refX/refY`, dimensions).

## Why / Use cases

Use `fMarker` when connection semantics should be visually explicit.

Typical use cases:

- Distinguish direction or type of edge.
- Show selected-state marker variants.
- Match product branding with custom SVG marker geometry.

Use default markers if your graph does not need semantic marker styling.

## How it works

Each marker registers in the marker store and is hidden in-place. On connection redraw, marker definitions are cloned into connection SVG defs and referenced by marker ids.

## Configuration (Inputs/Outputs/Methods)

### Inputs

- `type: string;` Marker role. Built-in values are `EFMarkerType.START`, `EFMarkerType.END`, `EFMarkerType.SELECTED_START`, `EFMarkerType.SELECTED_END`.
- `width: number;`
- `height: number;`
- `refX: number;`
- `refY: number;`
- `orient: 'auto' | 'auto-start-reverse' | 'calculated' | string;` Default: `auto`.
- `markerUnits: 'strokeWidth' | 'userSpaceOnUse';` Default: `strokeWidth`.

### Outputs

- No outputs.

### Methods

- No public template API methods.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-marker` Host class for marker SVG elements.

## Notes / Pitfalls

- Marker dimensions and `refX/refY` must match your SVG path geometry; wrong values make arrowheads appear offset.
- Use `SELECTED_*` marker types if selected connections need different visuals.
- Marker components are hidden source definitions; visible marker rendering happens on connection paths.

## Example

::: ng-component <connection-markers></connection-markers> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-markers/connection-markers.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-markers/connection-markers.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-markers/connection-markers.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
