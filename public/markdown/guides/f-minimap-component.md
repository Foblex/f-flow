# Minimap

## Description

`FMinimapComponent` renders a compact overview of the current flow and supports drag-based viewport navigation.

- **Selector:** `f-minimap`
- **Class:** `FMinimapComponent`

**What you get**

- Real-time miniature view of node layout.
- Visible viewport rectangle overlay.
- Drag-to-pan integration through the main drag plugin.

## Why / Use cases

Use `f-minimap` when flow size exceeds the visible viewport and users need fast spatial navigation.

Typical use cases:

- Large process maps.
- Multi-cluster graphs where users jump between distant regions.
- Editors that need persistent orientation context.

A minimap can be unnecessary for very small, fixed-size flows.

## How it works

The component listens to transform changes, redraws minimap nodes and view box, and participates as a drag plugin (`F_BEFORE_MAIN_PLUGIN`) so pointer interaction in minimap can move the main canvas.

## Configuration (Inputs/Outputs/Methods)

### Inputs

- `fMinSize: InputSignal<number>;` Minimum virtual size for minimap scale/viewBox calculation. Default: `1000`.

### Outputs

- No direct outputs.

### Methods

- No public template API methods.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-minimap` Host class.
- `.f-minimap-view` Viewport rectangle class.
- `.f-minimap-node` Rendered node class.
- `.f-minimap-group` Rendered group class.
- `.f-selected` Applied to selected minimap nodes/groups.

## Notes / Pitfalls

- Drag interaction in minimap requires `fDraggable` on parent `f-flow`.
- `fMinSize` affects perceived scale; too small can clip context, too large can reduce useful detail.
- If custom node classes are sent to minimap via `fMinimapClass`, ensure corresponding CSS exists in minimap scope.

## Example

::: ng-component <minimap-example></minimap-example> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/minimap-example/minimap-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/minimap-example/minimap-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/minimap-example/minimap-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
