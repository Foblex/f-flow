# Drag Handle

**Selector:** `[fDragHandle]`  
**Class:** `FDragHandleDirective`

`FDragHandleDirective` marks an element as the **only** valid drag start surface for moving a node.

In Foblex Flow, node dragging is enabled by `fDraggable` on the parent `f-flow`, but **a drag start area must be defined**.  
The simplest option is to put `fDragHandle` on the node itself (the whole node becomes draggable). For more complex nodes, put it on a header or a dedicated grip.

## Why it exists

Real nodes often contain interactive UI (buttons, inputs, selects). If the whole node starts dragging from any pixel, you can easily break UX:

- clicking a button starts a drag,
- selecting text becomes hard,
- inputs lose focus.

`fDragHandle` lets you choose **exactly where dragging can start**.

## Common patterns

### Drag the whole node

Put `fDragHandle` on the same element as `fNode`.

```html
<div fNode fDragHandle [fNodePosition]="{ x: 100, y: 200 }">
  Node
</div>
```

### Drag only a header / grip

Put `fDragHandle` on a nested element.

```html
<div fNode [fNodePosition]="{ x: 100, y: 200 }">
  <div fDragHandle class="node-header">Header (drag here)</div>
  <button>Button (clickable)</button>
</div>
```

### Drag the whole node, but block dragging from specific inner elements

Sometimes you want the whole node draggable, **except** for a specific area (for example, an input or a toolbar).  
For this use case, use **`fDragBlocker`** on the inner element(s) that must _never_ start a drag.

```html
<div fNode fDragHandle [fNodePosition]="{ x: 100, y: 200 }">
  <div class="node-title">Drag anywhere…</div>

  <input fDragBlocker placeholder="…but not from this input" />
  <button fDragBlocker>And not from this button</button>
</div>
```

## Styling

- `.f-component` Base class for flow primitives.
- `.f-drag-handle` Host class added by the directive.

## Notes / Pitfalls

- `fDragHandle` works only when `fDraggable` is enabled on the parent `f-flow`.
- A node must contain **at least one** `fDragHandle` to be movable.
- You can place the handle on a nested element **or on the node element itself**.

## Example

::: ng-component <drag-handle></drag-handle> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-handle/drag-handle.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-handle/drag-handle.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-handle/drag-handle.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
