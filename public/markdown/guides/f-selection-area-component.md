# Selection Area

**Selector:** `f-selection-area`  
**Class:** `FSelectionArea`

`FSelectionArea` enables rectangle-based multi-select in a flow.

## Why / Use cases

Use `f-selection-area` when users need to select many items quickly.

Typical use cases:

- Bulk move operations.
- Batch edit/delete workflows.
- Diagram tools with large, dense node sets.

If your editor is single-select only, this plugin may be unnecessary.

## How it works

On pointer down, the plugin checks `fTrigger`. If allowed, it shows the selection rectangle host, updates its bounds on move, computes intersections, marks matching elements selected, then finalizes selection on pointer up.

## API

### Inputs

- `fTrigger: FEventTrigger;` Selection-start predicate. Default trigger returns `event.shiftKey`.

### Outputs

- No direct outputs from this component.

Selection changes are emitted by [`fDraggable`](f-draggable-directive) through `fSelectionChange`.

### Methods

- No public template API methods.

### Types

#### FEventTrigger

```typescript
type FEventTrigger = (event: MouseEvent | TouchEvent | WheelEvent) => boolean;
```

## Styling

- `.f-component` Base class for flow primitives.
- `.f-selection-area` Host class of selection rectangle element.

## Notes / Pitfalls

- Requires `fDraggable` on parent `f-flow`.
- Selection rectangle is hidden by default; style `.f-selection-area` in your app/theme so users can see it.
- Trigger collisions can happen if `fTrigger` overlaps with other drag gestures.

## Example

::: ng-component <selection-area></selection-area> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/selection-area/selection-area.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/selection-area/selection-area.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/selection-area/selection-area.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
