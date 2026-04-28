---
toc: false
wideContent: true
---

# Magnetic Rects

## Description

**Magnetic Rects** add **equal spacing** snapping to **Foblex Flow for Angular**.

When you drag a node near a row or column of already aligned nodes, the plugin:

- detects aligned nodes on the same line (top/center/bottom or left/center/right),
- measures the **gap** between neighbors,
- suggests the **same spacing** for the dragged node,
- renders **rectangles** that visualize the spacing zones, so the snap result is obvious.

This is especially useful for building clean diagrams, UI flows, and node editors where consistent spacing matters.

## Example

::: ng-component <magnetic-rects></magnetic-rects> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/magnetic-rects/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/magnetic-rects/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/magnetic-rects/example.scss
:::

## How it works

1. Add `<f-magnetic-rects>` inside `<f-flow>`.
2. Configure both thresholds:

- `alignThreshold` for deciding when nodes count as aligned on the helper line
- `spacingThreshold` for deciding when the dragged node is close enough to snap into equal spacing

3. Drag nodes until spacing rectangles appear and the candidate position locks in.

> Tip: Start with `alignThreshold="30–50"` and `spacingThreshold="30–50"` for a more Figma-like feel.

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
