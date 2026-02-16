# Rotate Handle

**Selector:** `[fRotateHandle]`  
**Class:** `FRotateHandleDirective`

`FRotateHandleDirective` marks an element as a **rotation handle** for a node or a group.  
When the user drags this handle, the library performs a rotate interaction and commits the final angle through node/group outputs.

This directive is usually used together with:

- [`f-flow`](f-flow-component) + `fDraggable` (enables interactions)
- [`fNode`](f-node-directive) / [`fGroup`](f-group-directive) (the element being rotated)

## Quick start

### Add a rotate handle to a node

Place any element with `fRotateHandle` inside your node template. Often it’s a small “knob” in a corner.

```html
<f-flow fDraggable>
  <f-canvas>
    <div fNode [fNodePosition]="{ x: 120, y: 80 }" [fNodeRotate]="0">
      <div class="title" fDragHandle>Drag</div>

      <button class="rotate" fRotateHandle>
        Rotate
      </button>
    </div>
  </f-canvas>
</f-flow>
```

> Tip: Make the rotate handle visually different from the drag handle (cursor, icon, placement) so users don’t accidentally move instead of rotate.

## How it works

- During pointer down, the drag pipeline checks whether the event started on an element marked with `fRotateHandle`.
- If yes, the interaction is routed into rotation logic (instead of move/resize).
- For smooth UX, the library rotates internally while dragging.
- **Your app typically persists the final angle** when the interaction finishes via:
  - `fNodeRotateChange` (for nodes)
  - `fGroupRotateChange` (for groups)

This matches the overall model of Foblex Flow: the library handles interactive rendering, and your app owns the persisted diagram state.

## API

### Inputs

- No inputs.

### Outputs

- No outputs.

### Methods

- No public template API methods.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-rotate-handle` Class added to the host element by the directive.

Common patterns:

- Use `cursor: grab` / `cursor: crosshair` for the rotate handle.
- Place the handle outside the main content area (corner/edge) to avoid conflicting with clicks and text selection.

## Notes and pitfalls

- Requires `fDraggable` on the parent `f-flow`; without it, the handle is inert.
- If you have both `fDragHandle` and `fRotateHandle` in a small area, hit-testing can feel inconsistent - increase handle size or spacing.
- If you persist layout state, remember to save rotation together with position/size (e.g., on `fNodeRotateChange`).

## Example

::: ng-component <rotate-handle></rotate-handle> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/rotate-handle/rotate-handle.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/rotate-handle/rotate-handle.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/rotate-handle/rotate-handle.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
