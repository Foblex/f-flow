# Line Alignment

**Selector:** `f-line-alignment`  
**Class:** `FLineAlignmentComponent`

`FLineAlignmentComponent` is a legacy alignment helper that shows guide lines while dragging nodes.

> [!WARNING]
> This component is deprecated and will be removed in `v19.0.0`. Use [`f-magnetic-lines`](f-magnetic-lines-component) instead.

## Why / Use cases

Use this only when maintaining existing flows that already depend on `f-line-alignment`.

For new implementations, prefer `f-magnetic-lines` because it is the current API surface.

## How it works

The component extends magnetic-lines base behavior and registers under the same internal plugin slot (`MAGNETIC_LINES`) with a legacy input alias.

## API

### Inputs

- `fAlignThreshold: number;` Default: `10`. Snap distance in pixels. Alias for `threshold`.

### Outputs

- No outputs.

### Methods

- No public template API methods.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-line-alignment` Host class.

## Notes / Pitfalls

- Do not mix `f-line-alignment` and `f-magnetic-lines` in the same flow; they target the same helper responsibility.
- Migrate to `f-magnetic-lines` early to avoid future major-version removal risk.

## Example

::: ng-component <help-in-positioning></help-in-positioning> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/help-in-positioning/help-in-positioning.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/help-in-positioning/help-in-positioning.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/help-in-positioning/help-in-positioning.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
