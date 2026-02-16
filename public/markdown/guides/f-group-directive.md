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

- `fGroupId: string;` Group identifier. Default: `f-group-${uniqueId++}`.
- `fGroupParentId: string | null;` Parent group or node ID.
- `fGroupPosition: IPoint;` **Model.** Position of the group.
- `fGroupSize: ISize;` Size of the group.
- `fGroupRotate: number;` **Model.** Rotation angle in degrees.
- `fConnectOnNode: boolean;` Default: `true`. Allows dropping connections on the group.
- `fMinimapClass: string | string[];` CSS class for the minimap representation.
- `fGroupDraggingDisabled: boolean;` Default: `false`. Disables dragging.
- `fGroupSelectionDisabled: boolean;` Default: `false`. Disables selection.
- `fIncludePadding: boolean;` Default: `true`. Include padding in bounds calculation.
- `fAutoExpandOnChildHit: boolean;` Default: `false`. Expand group when child hits bounds.
- `fAutoSizeToFitChildren: boolean;` Default: `false`. Auto-resize to fit children.

### Outputs

- `fGroupPositionChange: OutputEmitterRef<IPoint>;` Emits when position changes.
- `fGroupRotateChange: OutputEmitterRef<number>;` Emits when rotation changes.
- `fGroupSizeChange: OutputEmitterRef<IRect>;` Emits when size changes.

### Methods

- `refresh(): void;` Force refresh of the group.

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
