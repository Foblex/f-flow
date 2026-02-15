# Group

**Selector:** `[fGroup]`  
**Class:** `FGroupDirective`

`FGroupDirective` turns an element into a **group container** inside a Foblex Flow diagram.  
A group behaves like a node (position, size, rotation, selection, drag), but it’s intended to **contain other nodes/groups** and act as a bounded area for organizing the diagram.

Groups must be placed inside [`f-canvas`](f-canvas-component) (which itself must be inside [`f-flow`](f-flow-component)).

## Quick start

### A group with a fixed position and size

```html
<f-flow>
  <f-canvas>
    <div
      fGroup
      [fGroupPosition]="{ x: 80, y: 60 }"
      [fGroupSize]="{ width: 400, height: 260 }"
    >
      My group
    </div>
  </f-canvas>
</f-flow>
```

### Make it draggable

To drag groups, enable `fDraggable` on the flow and provide a drag handle on the group (or inside it):

```html
<f-flow fDraggable>
  <f-canvas>
    <div
      fGroup
      [fGroupPosition]="{ x: 80, y: 60 }"
      [fGroupSize]="{ width: 400, height: 260 }"
    >
      <div fDragHandle class="title">Drag group here</div>
      <div class="body">Content</div>
    </div>
  </f-canvas>
</f-flow>
```

### Put nodes inside the group

Groups are “containers” via **parent ids**.  
To attach a node to a group, set the node’s `fNodeParentId` to the group’s `fGroupId`:

```html
<f-flow fDraggable>
  <f-canvas>
    <div fGroup [fGroupId]="'group-1'" [fGroupPosition]="{ x: 80, y: 60 }">
      <div fDragHandle class="title">Group</div>
    </div>

    <div
      fNode
      [fNodeParentId]="'group-1'"
      [fNodePosition]="{ x: 120, y: 120 }"
    >
      Child node
    </div>
  </f-canvas>
</f-flow>
```

## How it works

- A group registers in the same internal store as nodes and participates in rendering and hit-testing.
- During interactions (drag/resize/rotate), the library updates the group internally for smooth UX.
- Children are associated to the group via `fNodeParentId` / `fGroupParentId`, which enables container behaviors (bounds restrictions, auto-size rules, auto-expand rules).
- **Your app typically persists changes on “final” outputs** (for example `fGroupPositionChange` after a drag ends), keeping your data model as the source of truth.

## API

### Inputs

- `fGroupId: InputSignal<string>;` Group identifier. Default: `f-group-${uniqueId++}`. Use a **stable** id if you want hierarchy/selection to survive rerenders.

- `fGroupParentId: InputSignal<string | null | undefined>;` Parent group/node id (logical hierarchy). Default: `null`.

- `fGroupPosition: ModelSignal<IPoint>;` Group position in **flow coordinates**.

- `fGroupSize: InputSignal<ISize | undefined>;` Optional fixed size. If omitted, the size is measured from content (and can change as content changes).

- `fGroupRotate: ModelSignal<number>;` Default: `0`. Rotation (degrees). Affects group geometry and child bounds.

- `fConnectOnNode: InputSignal<boolean>;` Default: `true`. Allows dropping a connection onto the group body (not directly on an input). The library will choose the first available connectable input (if your template includes connectors).

- `fMinimapClass: InputSignal<string | string[]>;` Extra CSS class(es) applied in the minimap only.

- `fGroupDraggingDisabled: InputSignal<boolean>;` Default: `false`. Locks dragging for this group.

- `fGroupSelectionDisabled: InputSignal<boolean>;` Default: `false`. Prevents selecting this group.

- `fIncludePadding: InputSignal<boolean>;` Default: `true`. When restricting child movement, controls whether the group’s CSS padding is considered part of the “inner bounds”.

- `fAutoExpandOnChildHit: InputSignal<boolean>;` Default: `false`. Container UX: auto-expand a collapsed group when a child is dragged into it.

- `fAutoSizeToFitChildren: InputSignal<boolean>;` Default: `false`. Container UX: resize the group so all children fit inside it.

### Outputs

> Important: outputs are designed for **state persistence**.  
> In typical drag flows, you react to the final result (not per-mousemove streaming).

- `fGroupPositionChange: OutputEmitterRef<IPoint>;`  
  Emits when the final group position is committed by an interaction (for example, after drag ends).

- `fGroupRotateChange: OutputEmitterRef<number>;`  
  Emits when rotation is committed (after rotate interaction ends).

- `fGroupSizeChange: OutputEmitterRef<IRect>;`  
  Emits when resize is committed (after resize ends). Payload is the resulting rect.

### Methods

- `refresh(): void;` Forces a group refresh for cases where geometry/bounds must be recalculated (for example, after significant DOM/content changes).

## Styling

- `.f-component` Base class for flow primitives.
- `.f-group` Group host class.
- `.f-group-dragging-disabled` Applied when `fGroupDraggingDisabled = true`.
- `.f-group-selection-disabled` Applied when `fGroupSelectionDisabled = true`.
- `.f-selected` Applied when the group is selected.

## Notes and pitfalls

- Groups don’t “contain” children by DOM nesting — hierarchy is controlled by `fNodeParentId` / `fGroupParentId`.
- If you want strict bounded movement for children, ensure the parent id is set correctly and keep `fIncludePadding` in mind.
- Auto-size/auto-expand features can change group bounds during child movement — handle `fGroupSizeChange` if you persist layout.
- For consistent UX, style selected groups clearly (for example a stronger border or background).

## Example

::: ng-component <grouping></grouping> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/grouping/grouping.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/grouping/grouping.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/grouping/grouping.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
