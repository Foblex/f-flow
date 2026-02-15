# External Item

## Description

External item directives let you drag items from outside the canvas and create nodes on drop.

- **Selector:** `[fExternalItem]`
- **Class:** `FExternalItemDirective<TData>`

Additional selectors:

- `ng-template[fExternalItemPreview]` (`FExternalItemPreviewDirective`)
- `ng-template[fExternalItemPlaceholder]` (`FExternalItemPlaceholderDirective`)

**What you get**

- Palette-to-canvas drag-and-drop.
- Optional custom preview and placeholder templates.
- Node creation event with drop rect/data payload.

## Why / Use cases

Use external items when your editor has a toolbox/palette and users should create nodes by dragging from it.

Typical use cases:

- Low-code builders with component palettes.
- Visual workflow editors with draggable block templates.
- Diagram tools that create nodes from external catalog items.

## How it works

An element with `fExternalItem` is registered in `FExternalItemService`. During drag, the external-item handler creates preview/placeholder visuals and, on valid drop, emits `fCreateNode` from `fDraggable` with `FCreateNodeEvent`.

## Configuration (Inputs/Outputs/Methods)

### Inputs (`[fExternalItem]`)

- `fExternalItemId: string;` Default: `f-external-item-${uniqueId++}`.
- `fData: TData | undefined;`
- `fDisabled: boolean;` Default: `false`.
- `fPreview: TemplateRef<unknown> | undefined;`
- `fPreviewMatchSize: boolean;` Default: `true`.
- `fPlaceholder: TemplateRef<unknown> | undefined;`

### Outputs

- No outputs on the directive itself.
- Consume on `f-flow[fDraggable]`: `fCreateNode: EventEmitter<FCreateNodeEvent>;`.

`FCreateNodeEvent` payload fields:

- `rect: IRect`
- `data: TData`
- `fTargetNode?: string`
- `fDropPosition?: IPoint`

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
