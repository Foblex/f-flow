# Magnetic Lines

**Selector:** `f-magnetic-lines`  
**Class:** `FMagneticLines`

`FMagneticLines` displays guide lines while dragging nodes to help visual alignment.

## Why / Use cases

Use `f-magnetic-lines` when precise alignment matters but you do not want a full grid snap workflow.

Typical use cases:

- Canvas editors with manual but assisted placement.
- UIs where users align cards/components by visual guides.
- Replacing deprecated `f-line-alignment` with the current API.

## How it works

The plugin registers in the drag subsystem, computes candidate guide axes against nearby nodes, and renders temporary guide elements during node drag.

## API

### Inputs

- `threshold: number;` Default: `10`. Distance in pixels within which nodes will snap to the alignment lines.

### Outputs

- No outputs.

### Methods

- No public template API methods.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-magnetic-lines` Host class.
- `.f-line` Rendered helper line element class.

## Notes / Pitfalls

- This helper affects UX feedback only; it does not persist node positions.
- Very small thresholds can make guides feel inconsistent; very large thresholds can feel sticky.
- Requires active dragging (`fDraggable`) to be useful.

## Example

::: ng-component <magnetic-lines></magnetic-lines> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-lines/magnetic-lines.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-lines/magnetic-lines.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-lines/magnetic-lines.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
