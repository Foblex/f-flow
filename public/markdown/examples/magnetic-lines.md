# Magnetic Lines

## Description

**Magnetic Lines** add snap-to-align guides while you drag nodes in **Foblex Flow for Angular**.  
When a dragged node gets close to another node, the plugin shows **alignment lines** and can snap the node to:

- **Left / center / right** (X axis)
- **Top / center / bottom** (Y axis)

This makes it easy to keep diagrams clean and consistent without manual pixel-perfect positioning.

### How it works

1. Add `<f-magnetic-lines>` inside `<f-flow>`.
2. Set a `threshold` (in px) — the distance at which snapping and guide rendering starts.
3. Drag nodes — lines appear near matching edges/centers, and the node snaps into alignment.

> Tip: Start with `threshold="30–50"` for a “Figma-like” feel.

## Configuration

### threshold

`threshold` controls when magnetic lines appear and when snapping is applied.

- **Smaller value** → fewer snaps, more manual control
- **Larger value** → stronger snapping, easier alignment

```html
<f-magnetic-lines [threshold]="40" />
```

## Notes

- Magnetic Lines are purely UX helpers: they don’t change your data model - they only help users position nodes while dragging.
- You can style the guide lines via CSS (see the example `.f-magnetic-lines` `.f-line rule`).

## Example

::: ng-component <magnetic-lines></magnetic-lines> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-lines/magnetic-lines.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-lines/magnetic-lines.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/magnetic-lines/magnetic-lines.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
