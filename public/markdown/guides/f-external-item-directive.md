# External Item

**Selector:** `[fExternalItem]`  
**Class:** `FExternalItemDirective<TData>`

External item directives let you drag items from outside the canvas and create nodes on drop.

## Why / Use cases

Use external items when your editor has a toolbox/palette and users should create nodes by dragging from it.

Typical use cases:

- Low-code builders with component palettes.
- Visual workflow editors with draggable block templates.
- Diagram tools that create nodes from external catalog items.

## How it works

An element with `fExternalItem` is registered in `FExternalItemService`. During drag, the external-item handler creates preview/placeholder visuals and, on valid drop, emits `fCreateNode` from `fDraggable` with `FCreateNodeEvent`.

## API

### Inputs

- `fExternalItemId: string;` Unique identifier for the item. Default: Auto-generated `f-external-item-{id}`.
- `fData: TData;` Data payload associated with the item, passed to `fCreateNode` event on drop.
- `fDisabled: boolean;` Default: `false`. Disables dragging of this item.
- `fPreview: TemplateRef<unknown>;` Custom template for the drag preview.
- `fPreviewMatchSize: boolean;` Default: `true`. If true, the preview element matches the size of the source element.
- `fPlaceholder: TemplateRef<unknown>;` Custom template for the placeholder shown in the list while dragging.

### Outputs

- No outputs on the directive itself.
- Consume on `f-flow[fDraggable]`: `fCreateNode: EventEmitter<FCreateNodeEvent>;`.

### Methods

- No public template API methods.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-external-item` Host class.
- `.f-external-item-disabled` Disabled class.
- `.f-external-item-preview` Preview-template class.
- `.f-external-item-placeholder` Placeholder-template class.

## Notes / Pitfalls

- Requires `fDraggable` on `f-flow` so drag pipeline can emit `fCreateNode`.
- Child pointer events of external item are disabled by the directive to keep dragging reliable.
- Keep `fData` serializable/predictable if you persist created node state.

## Example

::: ng-component <add-node-from-palette></add-node-from-palette> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
