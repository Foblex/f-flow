# Selection System

Selection in **Foblex Flow** is the core UX mechanism for working with a diagram: it tells the user _what is currently active_ and enables batch actions.

Selection covers:

- **Nodes** (and therefore **groups** that are associated with those nodes),
- **Connections**,
- and supports both user-driven and programmatic control.

You can select by click, toggle items in multi-select mode, drag a selection rectangle, or manage selection via [`FFlowComponent`](/f-flow-component) APIs.

## Why / Use cases

Use the selection system whenever users need to inspect, move, or edit more than one item.

Common scenarios:

- **Inspector panel:** click a node → show its properties on the right.
- **Batch move:** select several nodes → drag them together.
- **Batch actions:** delete, group/ungroup, change settings for the selected set.
- **Keyboard workflows:** `Escape` clears selection, `Ctrl/Meta + A` selects all, `Delete` removes items (in your app state).

Selection is also a UX contract: the library adds `.f-selected`, but **you decide how it looks**.

## How it works

Internally, selection lives in the draggable interaction context (`selectedItems`) and is updated by two primary paths:

- **Pointer path** - `SelectByPointer`  
  Handles single select and multi-select toggle logic.
- **Box path** - `SelectionAreaHandler`  
  Handles rectangle selection based on intersection rules.

After the selection logic is finalized, `EmitSelectionChangeEvent` emits `FSelectionChangeEvent` **only when the selection actually changed**.  
This keeps handlers predictable and avoids unnecessary re-renders.

## Configuration (Inputs/Outputs/Methods)

### Inputs

- `fMultiSelectTrigger: FEventTrigger;` on `f-flow[fDraggable]`  
  Enables toggle multi-select mode.

- `fTrigger: FEventTrigger;` on `f-selection-area`  
  Controls when box selection starts (default: `event.shiftKey`).

> Recommended UX defaults: **Shift** for box selection, **Ctrl/Meta** for toggle multi-select.

### Outputs

- `fSelectionChange: EventEmitter<FSelectionChangeEvent>;` on `f-flow[fDraggable]`.

`FSelectionChangeEvent` fields:

- `nodeIds`, `groupIds`, `connectionIds`
- legacy aliases: `fNodeIds`, `fGroupIds`, `fConnectionIds`

> `groupIds` are derived automatically from selected nodes.

### Methods [`FFlowComponent`](/f-flow-component)

Use these methods when selection is driven by external UI (toolbars, side panels, shortcuts):

- `getSelection(): ICurrentSelection`
- `selectAll(): void`
- `select(nodesAndGroups: string[], connections: string[], isSelectedChanged: boolean = true): void`
- `clearSelection(): void`

## Styling

- `.f-selected` is applied to selected nodes/groups/connections.
- `.f-selection-area` is the selection rectangle host class.

## Notes / Pitfalls

- `select(...)` requires valid existing ids; unknown ids are ignored.
- Multi-select behavior depends on `fMultiSelectTrigger`.
- If `.f-selected` styling is too subtle, users won’t understand current selection state.

## Example

### Selection Events

Listen to selection changes and show selected item ids in a side panel.

::: ng-component <node-selection></node-selection> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/node-selection/node-selection.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/node-selection/node-selection.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/node-selection/node-selection.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

### Box Selection

Select multiple items by dragging a rectangle around them. By default, the trigger is `Shift + pointer down`, but you can customize it with the `fTrigger` input.

::: ng-component <selection-area></selection-area> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/selection-area/selection-area.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/selection-area/selection-area.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/selection-area/selection-area.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
