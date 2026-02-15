# Magnetic Rects

## Description

**Magnetic Rects** add **equal spacing** snapping to **Foblex Flow for Angular**.

When you drag a node near a row or column of already aligned nodes, the plugin:

- detects aligned nodes on the same line (top/center/bottom or left/center/right),
- measures the **gap** between neighbors,
- suggests the **same spacing** for the dragged node,
- renders **rectangles** that visualize the spacing zones, so the snap result is obvious.

This is especially useful for building clean diagrams, UI flows, and node editors where consistent spacing matters.

### How it works

1. Add `<f-magnetic-rects>` inside `<f-flow>`.
2. Configure two thresholds:

- `alignThreshold` — how close nodes must be to be considered aligned on the helper line
- `spacingThreshold` — how close the dragged node must be to the “ideal spacing” position to snap

3. Drag nodes to see spacing rectangles and snapping suggestions.

> Tip: Start with `alignThreshold="30–50"` and `spacingThreshold="30–50"` for a “Figma-like” feel.

## Configuration

### alignThreshold

Defines the maximum distance (in px) for nodes to be treated as aligned on the same guide line.

- Smaller value → fewer matches, more strict alignment
- Larger value → more matches, easier to trigger spacing hints

```html
<f-magnetic-rects [alignThreshold]="40" />
```

### spacingThreshold

Controls how close the dragged node must be to the “equal spacing” position before snapping is suggested.

- Smaller value → less snapping, more manual movement
- Larger value → stronger snapping

```html
<f-magnetic-rects [spacingThreshold]="40" />
```

## Notes

- Magnetic Rects focus on spacing. If you need classic alignment guides for edges and centers, use Magnetic Lines.
- The plugin is UX-only and does not own your diagram state - you still control node positions.

## Example

::: ng-component <magnetic-rects></magnetic-rects> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-rects/magnetic-rects.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-rects/magnetic-rects.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-rects/magnetic-rects.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
