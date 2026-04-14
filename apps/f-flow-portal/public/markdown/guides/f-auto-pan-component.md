# Auto Pan

**Selector:** `f-auto-pan`  
**Class:** `FAutoPanComponent`

`FAutoPanComponent` adds edge-based viewport scrolling to supported drag sessions inside `f-flow`.

## Why / Use cases

Use `f-auto-pan` when dragged items or targets can move outside the visible viewport and users should be able to continue the same drag session without manually panning first.

Typical use cases:

- Connect to off-screen inputs.
- Reassign connections to distant targets.
- Drag nodes across large canvases.
- Extend a selection rectangle beyond the current viewport.

If your flow always fits on screen, this plugin may be unnecessary.

## How it works

The component registers itself as a flow plugin. During supported drag sessions, the drag runtime checks whether the pointer is inside the configured edge threshold. If it is, the canvas is panned with `requestAnimationFrame` while the active drag handler keeps receiving move updates.

## API

### Inputs

- `fEdgeThreshold: number;` Default: `20`. Edge activation zone in viewport pixels.
- `fSpeed: number;` Default: `8`. Maximum per-frame canvas delta in viewport pixels.
- `fAcceleration: boolean;` Default: `false`. When enabled, speed scales linearly as the pointer approaches the edge.

### Outputs

- No outputs.

### Methods

- No public template API methods.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-auto-pan` Host class for the plugin element.

## Notes / Pitfalls

- Requires `fDraggable` on the parent `f-flow`.
- Auto-pan is enabled by the presence of `<f-auto-pan />`.
- Supported drag kinds are `drag-node`, `create-connection`, `reassign-connection`, and `selection-area`.
- `fEdgeThreshold` and `fSpeed` are measured in viewport pixels, not in flow coordinates.

## Example

::: ng-component <auto-pan></auto-pan> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/auto-pan/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/auto-pan/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/auto-pan/example.scss
:::
