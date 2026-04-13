# Connection Marker

**Selectors:** `svg[fMarker]`, `f-connection-marker-circle`, `f-connection-marker-arrow`  
**Classes:** `FConnectionMarker`, `FConnectionMarkerCircle`, `FConnectionMarkerArrow`

Connection markers let you define reusable visuals for connection starts and ends.

There are now two ways to use them:

- Built-in marker components for the common cases.
- `svg[fMarker]` for fully custom SVG geometry.

## Why / Use cases

Use connection markers when edge semantics should be visually explicit.

Typical use cases:

- Distinguish direction or type of edge.
- Show selected-state marker variants.
- Match product branding with custom SVG marker geometry.
- Reuse the same marker for both normal and selected states.

Use built-in markers when the default shapes are enough. Use `svg[fMarker]` when geometry, sizing, or branding must be custom.

## How it works

Marker definitions are declared inside `f-connection`. During connection redraw, the library clones those definitions into the connection `<defs>` block and applies them to the rendered path.

Built-in markers hide the SVG boilerplate from the template, while `svg[fMarker]` gives you full control over the shape.

## Built-in markers

### `f-connection-marker-circle`

Use it when you want the default circular start marker.

```html
<f-connection>
  <f-connection-marker-circle></f-connection-marker-circle>
</f-connection>
```

By default it targets `START_ALL_STATES`.

### `f-connection-marker-arrow`

Use it when you want the default arrow end marker.

```html
<f-connection>
  <f-connection-marker-arrow></f-connection-marker-arrow>
</f-connection>
```

By default it targets `END_ALL_STATES`.

Both built-in markers accept the same `type` input as custom markers, so you can override the default state mapping when needed.

## Custom SVG markers

Use `svg[fMarker]` when the marker geometry, `viewBox`, `refX`, `refY`, or size should be fully custom.

```html
<f-connection>
  <svg
    fMarker
    viewBox="0 0 6 7"
    [type]="eMarkerType.END_ALL_STATES"
    [width]="6"
    [height]="7"
    [refX]="5.5"
    [refY]="3.5"
    markerUnits="strokeWidth"
    orient="auto"
  >
    <path d="M5.99961 7L0 3.5L5.99961 0V7Z" />
  </svg>
</f-connection>
```

## API

### Inputs

- `type: EFMarkerType | string;` Default depends on the marker.
- `width: number;` Default: `0` for `svg[fMarker]`.
- `height: number;` Default: `0` for `svg[fMarker]`.
- `refX: number;` Default: `0` for `svg[fMarker]`.
- `refY: number;` Default: `0` for `svg[fMarker]`.
- `orient: string;` Default: `auto`.
- `markerUnits: string;` Default: `strokeWidth`.

Built-in markers expose only `type`, because their SVG geometry and marker metrics are already preconfigured.

### Marker types

You can pass the enum or the short string aliases:

- `START` or `start`
- `END` or `end`
- `SELECTED_START` or `selected-start`
- `SELECTED_END` or `selected-end`
- `START_ALL_STATES` or `start-all-states`
- `END_ALL_STATES` or `end-all-states`

### `EFMarkerType`

```typescript
enum EFMarkerType {
  START = 'f-connection-marker-start',
  END = 'f-connection-marker-end',
  SELECTED_START = 'f-connection-selected-marker-start',
  SELECTED_END = 'f-connection-selected-marker-end',
  START_ALL_STATES = 'f-connection-marker-start-all-states',
  END_ALL_STATES = 'f-connection-marker-end-all-states',
}
```

`START_ALL_STATES` expands to `START` and `SELECTED_START`. `END_ALL_STATES` expands to `END` and `SELECTED_END`.

## Recommended usage

- Use `<f-connection-marker-circle />` and `<f-connection-marker-arrow />` when the built-in shapes are enough.
- Use `START_ALL_STATES` and `END_ALL_STATES` when the same marker should appear in both normal and selected states.
- Use separate `START` / `SELECTED_START` or `END` / `SELECTED_END` markers only when the selected connection must look different.
- Use `svg[fMarker]` when you need fully custom geometry.

## Styling

- `.connection-marker` is the shape class used inside examples and built-in marker templates.
- Visible marker rendering happens on the connection path; marker declarations remain hidden source definitions.

## Notes / Pitfalls

- Marker dimensions and `refX/refY` must match your SVG path geometry; wrong values make markers look offset.
- `orient="auto"` is usually the correct choice for arrow-like markers.
- Built-in markers remove the need to write `<svg>` manually, but custom SVG markers remain the best option when branding matters.

## Example

::: ng-component <connection-markers></connection-markers> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-markers/connection-markers.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-markers/connection-markers.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-markers/connection-markers.scss
:::
