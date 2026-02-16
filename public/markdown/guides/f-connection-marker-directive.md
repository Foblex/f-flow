# Connection Marker

**Selector:** `svg[fMarker]`  
**Class:** `FConnectionMarker`

`FConnectionMarker` lets you define custom SVG markers for connection starts and ends.

## Why / Use cases

Use `fMarker` when connection semantics should be visually explicit.

Typical use cases:

- Distinguish direction or type of edge.
- Show selected-state marker variants.
- Match product branding with custom SVG marker geometry.

Use default markers if your graph does not need semantic marker styling.

## How it works

Each marker registers in the marker store and is hidden in-place. On connection redraw, marker definitions are cloned into connection SVG defs and referenced by marker ids.

## API

### Inputs

- `type: string;` Default: `start`. Marker role (`start` or `end`).
- `width: number;` Default: `0`. Marker width.
- `height: number;` Default: `0`. Marker height.
- `refX: number;` Default: `0`. Reference X coordinate.
- `refY: number;` Default: `0`. Reference Y coordinate.
- `orient: string;` Default: `auto`. SVG marker orientation.
- `markerUnits: string;` Default: `strokeWidth`. SVG marker units (`strokeWidth` or `userSpaceOnUse`).

### Types

#### EFMarkerType

```typescript
enum EFMarkerType {
  START = 'start',
  END = 'end',
  SELECTED_START = 'selected-start',
  SELECTED_END = 'selected-end',
}
```

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
