# Background

**Selector:** `f-background`  
**Class:** `FBackgroundComponent`

`FBackgroundComponent` renders an SVG background layer that follows canvas transform. You can plug built-in patterns or provide a custom pattern implementation.

## Why / Use cases

Use `f-background` to improve spatial orientation in editing surfaces.

Typical use cases:

- Node alignment with visible grid rhythm.
- Visual depth for large canvases.
- Branded or domain-specific pattern overlays.

Skip it for print-like diagrams where a plain background is preferred.

## How it works

`f-background` registers as a plugin and receives canvas transform updates. The projected pattern component recalculates SVG pattern attributes (`x/y/width/height` and shape geometry) from that transform.

## API

### FBackgroundComponent (`f-background`)

- **Inputs:** none
- **Outputs:** none

### FCirclePatternComponent (`f-circle-pattern`)

**Selector:** `f-circle-pattern`

- `id: InputSignal<string>;` Default: `f-pattern-${uniqueId++}`.
- `color: InputSignal<string>;` Default: `rgba(0,0,0,0.1)`.
- `radius: InputSignal<number>;` Default: `20`.

### FRectPatternComponent (`f-rect-pattern`)

**Selector:** `f-rect-pattern`

- `id: InputSignal<string>;` Default: `f-pattern-${uniqueId++}`.
- `vColor: InputSignal<string>;` Default: `rgba(0,0,0,0.1)`.
- `hColor: InputSignal<string>;` Default: `rgba(0,0,0,0.1)`.
- `vSize: InputSignal<number>;` Default: `20`.
- `hSize: InputSignal<number>;` Default: `20`.

### Custom pattern contract

- Token: `F_BACKGROUND_PATTERN`
- Interface: `IFBackgroundPattern`
- Required API: `hostElement` and `setTransform(transform: ITransformModel): void`

### Types

#### IFBackgroundPattern

```typescript
interface IFBackgroundPattern {
  hostElement: HTMLElement | SVGElement;
  setTransform(transform: ITransformModel): void;
}
```

#### ITransformModel

```typescript
interface ITransformModel {
  position: IPoint; // { x: number, y: number }
  scale: number;
}
```

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
