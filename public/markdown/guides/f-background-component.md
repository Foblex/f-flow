# Background

## Description

`FBackgroundComponent` renders an SVG background layer that follows canvas transform. You can plug built-in patterns or provide a custom pattern implementation.

- **Selector:** `f-background`
- **Class:** `FBackgroundComponent`

**What you get**

- Grid/dot-like visual context that tracks pan/zoom.
- Built-in pattern primitives (`f-circle-pattern`, `f-rect-pattern`).
- Custom pattern support via `F_BACKGROUND_PATTERN` + `IFBackgroundPattern`.

## Why / Use cases

Use `f-background` to improve spatial orientation in editing surfaces.

Typical use cases:

- Node alignment with visible grid rhythm.
- Visual depth for large canvases.
- Branded or domain-specific pattern overlays.

Skip it for print-like diagrams where a plain background is preferred.

## How it works

`f-background` registers as a plugin and receives canvas transform updates. The projected pattern component recalculates SVG pattern attributes (`x/y/width/height` and shape geometry) from that transform.

## Configuration (Inputs/Outputs/Methods)

### `f-background`

- **Selector:** `f-background`
- **Class:** `FBackgroundComponent`
- **Inputs:** none
- **Outputs:** none

### `f-circle-pattern`

- **Selector:** `f-circle-pattern`
- **Class:** `FCirclePatternComponent`
- `id: InputSignal<string>;` Default: `f-pattern-${uniqueId++}`.
- `color: InputSignal<string>;` Default: `rgba(0,0,0,0.1)`.
- `radius: InputSignal<number>;` Default: `20`.

### `f-rect-pattern`

- **Selector:** `f-rect-pattern`
- **Class:** `FRectPatternComponent`
- `id: InputSignal<string>;` Default: `f-pattern-${uniqueId++}`.
- `vColor: InputSignal<string>;` Default: `rgba(0,0,0,0.1)`.
- `hColor: InputSignal<string>;` Default: `rgba(0,0,0,0.1)`.
- `vSize: InputSignal<number>;` Default: `20`.
- `hSize: InputSignal<number>;` Default: `20`.

### Custom pattern contract

- Token: `F_BACKGROUND_PATTERN`
- Interface: `IFBackgroundPattern`
- Required API: `hostElement` and `setTransform(transform: ITransformModel): void`

::: code-group

```html [circle]
<f-flow>
  <f-background>
    <f-circle-pattern [radius]="24"></f-circle-pattern>
  </f-background>
  <f-canvas></f-canvas>
</f-flow>
```

```html [rect]
<f-flow>
  <f-background>
    <f-rect-pattern [hSize]="32" [vSize]="32"></f-rect-pattern>
  </f-background>
  <f-canvas></f-canvas>
</f-flow>
```

:::

## Styling

- `.f-component` Base class for flow primitives.
- `.f-background` Host class for background layer.

## Notes / Pitfalls

- Place `f-background` as a sibling of `f-canvas` under the same `f-flow` so transform sync works correctly.
- Large, dense SVG patterns can impact rendering on very big canvases.
- If you provide a custom pattern, ensure `setTransform(...)` handles both scale and translated positions.

## Example

::: ng-component <background-example></background-example> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/background-example/background-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/background-example/background-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/background-example/background-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
