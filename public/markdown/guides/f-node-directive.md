# Node

**Selector:** `[fNode]`  
**Class:** `FNodeDirective`

`FNodeDirective` turns any element into a **node** inside a Foblex Flow diagram: it can be positioned on the canvas, selected, dragged (with `fDraggable`), and used as a host for connectors.

Nodes must be placed inside [`f-canvas`](f-canvas-component) (which itself must be inside [`f-flow`](f-flow-component)).

## Quick start

### A node with a fixed position

```html
<f-flow>
  <f-canvas>
    <div fNode [fNodePosition]="{ x: 120, y: 80 }">My node</div>
  </f-canvas>
</f-flow>
```

### Make it draggable

To drag nodes, enable `fDraggable` on the flow and provide a drag handle inside the node:

```html
<f-flow fDraggable>
  <f-canvas>
    <div fNode [fNodePosition]="{ x: 120, y: 80 }">
      <div fDragHandle class="title">Drag here</div>
      <div class="body">Content</div>
    </div>
  </f-canvas>
</f-flow>
```

### Add connectors (optional)

Place connector directives inside the node and connect them using [`f-connection`](f-connection-component).

## How it works

- A node registers itself in the internal flow store and participates in rendering and hit-testing.
- During interactions (drag/resize/rotate), the library updates the node internally for smooth UX.
- **Your app typically persists changes on “final” outputs** (for example `fNodePositionChange` after a drag ends), keeping your data model as the source of truth.

## API

### Inputs

- `fNodeId: InputSignal<string>;` Node identifier. Default: `f-node-${uniqueId++}`. Use a **stable** id if you want selection/state to survive rerenders.

- `fNodeParentId: InputSignal<string | null | undefined>;` Parent node/group id (logical hierarchy). Default: `null`. Enables container behaviors such as bounds restrictions and auto-size rules (when used).

- `fNodePosition: ModelSignal<IPoint>;` Node position in **flow coordinates**. This is the primary property that defines where the node is rendered.

- `fNodeSize: InputSignal<ISize | undefined>;` Optional fixed size. If omitted, the size is measured from content (content changes can affect connection routing).

- `fNodeRotate: ModelSignal<number>;` Default: `0`. Rotation (degrees). Affects node geometry and connector placement.

- `fConnectOnNode: InputSignal<boolean>;` Default: `true`. Allows dropping a connection onto the node body (not directly on an input). The library will choose the first available connectable input.

- `fMinimapClass: InputSignal<string | string[]>;` Extra CSS class(es) applied in the minimap only.

- `fNodeDraggingDisabled: InputSignal<boolean>;` Default: `false`. Locks dragging for this node (useful for read-only/locked nodes).

- `fNodeSelectionDisabled: InputSignal<boolean>;` Default: `false`. Prevents selecting this node.

- `fIncludePadding: InputSignal<boolean>;` Default: `true`. When the node has a child, this controls whether the parent’s CSS padding is considered when restricting child movement.

- `fAutoExpandOnChildHit: InputSignal<boolean>;` Default: `false`. Container UX: auto-expand a collapsed parent when a child is dragged into it.

- `fAutoSizeToFitChildren: InputSignal<boolean>;` Default: `false`. Container UX: resize the parent node so all children fit inside it.

### Outputs

> Important: outputs are designed for **state persistence**.  
> In typical drag flows, you react to the final result (not per-mousemove streaming).

- `fNodePositionChange: OutputEmitterRef<IPoint>;`  
  Emits when the final node position is committed by an interaction (for example, after drag ends).

- `fNodeRotateChange: OutputEmitterRef<number>;`  
  Emits when rotation is committed (after rotate interaction ends).

- `fNodeSizeChange: OutputEmitterRef<IRect>;`  
  Emits when resize is committed (after resize ends). Payload is the resulting rect.

### Methods

- `refresh(): void;` Forces a node refresh for cases where geometry/connector placement must be recalculated (for example, after significant DOM/content changes that affect size/anchors).

### Types

#### IPoint

```typescript
interface IPoint {
  x: number;
  y: number;
}
```

#### ISize

```typescript
interface ISize {
  width: number;
  height: number;
}
```

#### IRect

```typescript
interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

## Styling

- `.f-component` Base class for flow primitives.
- `.f-node` Node host class.
- `.f-node-dragging-disabled` Applied when `fNodeDraggingDisabled = true`.
- `.f-node-selection-disabled` Applied when `fNodeSelectionDisabled = true`.
- `.f-selected` Applied when the node is selected.

## Notes and pitfalls

- If you render multiple nodes at the same position, they will overlap.
- If you rely on content-based sizing (no `fNodeSize`), dynamic content changes can cause re-measuring and affect connection routes — this is expected.
- When using `fNodeParentId`, make sure the referenced parent id exists; otherwise hierarchy-based behaviors won’t apply.
- Connector directives should normally live inside a node; “node-as-connector” patterns are only valid where explicitly documented by an example.

## Example

::: ng-component <custom-nodes></custom-nodes> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/custom-nodes/custom-nodes.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/custom-nodes/custom-nodes.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/custom-nodes/custom-nodes.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
