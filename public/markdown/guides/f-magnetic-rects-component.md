# Magnetic Rects

**Selector:** `f-magnetic-rects`  
**Class:** `FMagneticRects`

`FMagneticRects` shows spacing and alignment helper rectangles while dragging nodes.

## Why / Use cases

Use `f-magnetic-rects` when users need consistent visual rhythm (equal gaps) in addition to plain line alignment.

Typical use cases:

- Builder tools where spacing consistency is part of UX quality.
- Diagram editors with card-like blocks.
- Flows that should look hand-organized but still precise.

## How it works

During drag, helper calculations detect candidate spacing/alignment relationships and render temporary rectangle overlays to show potential placement matches.

## API

### Inputs

- `alignThreshold: number;` Default: `100`. Distance in pixels to show alignment guides for node edges/centers.
- `spacingThreshold: number;` Default: `100`. Distance in pixels to show equal spacing guides between nodes.

### Outputs

- No outputs.

### Methods

- No public template API methods.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-magnetic-rects` Host class.
- `.f-rect` Rendered helper rectangle class.

## Notes / Pitfalls

- High thresholds increase helper noise on dense diagrams.
- This helper is visual guidance, not automatic layout.
- Use with `fDraggable`; no drag means no helper rendering.

## Example

::: ng-component <magnetic-rects></magnetic-rects> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-rects/magnetic-rects.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-rects/magnetic-rects.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-rects/magnetic-rects.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
