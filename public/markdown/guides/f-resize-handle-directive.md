# Resize Handle

**Selector:** `[fResizeHandle]`  
**Class:** `FResizeHandleDirective`

`FResizeHandleDirective` marks an element as a **resize handle** for a [`fNode`](f-node-directive) or [`fGroup`](f-group-directive).  
It works only when [`fDraggable`](f-draggable-directive) is enabled on the parent [`f-flow`](f-flow-component).

Resize handles let users change node/group size directly on the canvas - similar to design tools.

## Quick start

### Add a resize handle to a node

Attach `fResizeHandle` to an element inside a node (or group) and specify the handle type.

```html
<f-flow fDraggable>
  <f-canvas>
    <div fNode [fNodePosition]="{ x: 120, y: 80 }">
      <div class="content">Resizable node</div>

      <div fResizeHandle fResizeHandleType="right-bottom" class="handle rb"></div>
    </div>
  </f-canvas>
</f-flow>
```

> Tip: In real UIs you usually render **8 handles** (corners + sides) for the best UX.

## How it works

- On pointer down, the drag pipeline detects `fResizeHandle` on the hit element.
- `fResizeHandleType` defines the resize direction (left/right/top/bottom and corners).
- During resize, the library updates the element internally for smooth interaction.
- **Your app typically persists the final result** using:
  - `fNodeSizeChange` from `fNode`
  - `fGroupSizeChange` from `fGroup`

This keeps your data model as the source of truth while interactions stay responsive.

## API

### Inputs

- `fResizeHandleType: EFResizeHandleType;` **Required.**  
  Defines which side/corner the handle represents.

`EFResizeHandleType` values:

- `left`
- `left-top`
- `top`
- `right-top`
- `right`
- `right-bottom`
- `bottom`
- `left-bottom`

### Outputs

The handle directive itself emits nothing.

Listen for size commits on the resized element instead:

- `fNodeSizeChange: OutputEmitterRef<IRect>;`
- `fGroupSizeChange: OutputEmitterRef<IRect>;`

## Styling

The directive adds the base class `.f-resize-handle` and a type-specific class you can target:

- `.f-resize-handle`
- `.f-resize-handle-left`
- `.f-resize-handle-left-top`
- `.f-resize-handle-top`
- `.f-resize-handle-right-top`
- `.f-resize-handle-right`
- `.f-resize-handle-right-bottom`
- `.f-resize-handle-bottom`
- `.f-resize-handle-left-bottom`

Minimal example styles:

```scss
.f-resize-handle {
  width: 10px;
  height: 10px;
  position: absolute;
  pointer-events: auto; // make sure it's hittable
}

.f-resize-handle-right-bottom {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
```

## Notes and pitfalls

- Resize works only with `fDraggable` enabled on `f-flow`.
- If handles are too small, users will miss them. Make the hit area generous.
- If your nodes can become too small visually, enforce minimum sizes in your app logic (or via your node template/layout constraints).
- When using content-based sizing elsewhere, remember that manual resizing is an explicit user override - treat it as a persisted property.

## Example

::: ng-component <resize-handle></resize-handle> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/resize-handle/resize-handle.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/resize-handle/resize-handle.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/resize-handle/resize-handle.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
