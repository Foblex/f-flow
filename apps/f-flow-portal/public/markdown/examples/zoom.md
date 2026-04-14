---
toc: false
wideContent: true
---

# Zoom

## Description

This guide shows how to `zoom in` and `zoom out` of the [canvas](./docs/f-canvas-component) using:

- **Mouse wheel**
- **Double click**
- **Buttons**
- **Pinch-to-zoom** (trackpad / touchscreen)

To enable zooming, add the [fZoom directive](./docs/f-zoom-directive) to the [f-canvas](./docs/f-canvas-component).

Zoom is a core interaction for any serious node editor. It helps users move from a high-level overview to fine-grained editing without losing orientation on large canvases.

It becomes even more important when the editor supports minimaps, large graphs, or touch-friendly interactions on trackpads and tablets.
Good zoom behavior is one of the easiest ways to improve perceived editor quality.

### Notes

- **Pinch-to-zoom** works on devices that support multi-touch gestures (touch screens and trackpads).
- The directive applies zoom with sensible limits to keep interactions smooth and predictable.

## Example

::: ng-component <zoom></zoom> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/zoom/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/zoom/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/zoom/example.scss
:::

## Related docs

- [Zoom Docs](./docs/f-zoom-directive)
- [Minimap Example](./examples/minimap)
- [Connection Waypoints Example](./examples/connection-waypoints)
