# Node

**Selector:** [fNode] 

The **FNodeDirective** is a directive that represents a node within a flow of elements. It is capable of interacting with other nodes and connectors, and can be dynamically positioned and styled.

## Inputs

  - `fNodeId: InputSignal<string>;` The unique identifier for the directive instance. Automatically generated. Default: `f-node-${uniqueId++}`.

  - `fNodeParentId: InputSignal<string | null | undefined>;` The ID of the parent node or group. If not specified, the node will be a top-level node in the flow. Default: `null`.

  - `fNodePosition: InputSignal<IPoint>;` Sets the position of the node. Redraws the node when the position changes.

  - `fNodeSize: InputSignal<ISize>;` Sets the size of the node. Redraws the node when the size changes. Node has a default size fitting its content, but you can specify a custom size.

  - `fNodeRotate: InputSignal<number>;` Sets the rotation angle of the node in degrees. Default: `0`.

  - `fNodeDraggingDisabled: InputSignal<boolean>;` Indicates whether the node cannot be dragged. Default: `false`.

  - `fNodeSelectionDisabled: InputSignal<boolean>;`  Indicates whether the node cannot be selected. Default: `false`.

  - `fIncludePadding: InputSignal<boolean>;` Determines whether the parent node’s or group’s inner spacing (CSS padding) is taken into account when restricting the movement of child nodes. When set to `true`, a child node cannot move beyond the parent’s edges or its inner padding. Default: `true`.

  - `fConnectOnNode: InputSignal<boolean>;` Allows creating a connection by dropping it anywhere on a node, instead of directly on an input connector. When enabled (`true`), if the connection is dropped on a node (not on a specific connector), the first available connectable input on that node will be automatically used. Default: `true`.

  - `fMinimapClass: InputSignal<string | string[]>;` Additional CSS classes to apply to the node in the minimap. This can be used to style the node differently in the minimap compared to its appearance in the main flow. Default: `[]`.

  - `fAutoExpandOnChildHit: InputSignal<boolean>;` When enabled (`true`), if a child node is dragged inside a collapsed parent node or group, the parent will automatically expand to accommodate the child. This feature is useful for maintaining visibility and accessibility of child nodes during drag operations. Default: `false`.

  - `fAutoSizeToFitChildren: InputSignal<boolean>;` When enabled (`true`), the node will automatically adjust its size to fit all its child nodes. This ensures that all child nodes are visible within the parent node without overflow. Default: `false`.

## Outputs

 - `fNodePositionChange: OutputEmitterRef<IPoint>;` Emits an event when the position of the node changes.  

 - `fNodeSizeChange: OutputEmitterRef<IRect>;` Emits an event when the size of the node changes using the [fResizeHandle](f-resize-handle-directive) directive.

## Methods

 - `refresh(): void;` Refreshes the state of the node, typically triggering a re-render or update.

## Styles

  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-node` Class specific to the node directive, providing styles for node representation.

  - `.f-node-dragging-disabled` Class applied to the node when `fNodeDraggingDisabled=true`.

  - `.f-node-selection-disabled` Class applied to the node when `fNodeSelectionDisabled=true`.

  - `.f-selected` Class applied to the node when it is selected.

## Usage

#### Node with Position

This code snippet shows a basic example of a node with a specified position.

```html
<f-flow>
  <f-canvas>
    |:|<div fNode [fNodePosition]="{ x: 100, y: 200 }"></div>|:|
  </f-canvas>
</f-flow>
```

#### Adding Dragging Functionality

Let's add the [fDraggable](f-draggable-directive) directive to the [f-flow](f-flow-component) to enable dragging functionality. 
Also, we need to add the [fDragHandle](f-drag-handle-directive) directive inside [fNode](f-node-directive) to specify the handle for dragging.
This can be any element inside the node that will act as the drag handle.

```html
<f-flow |:|fDraggable|:|>
  <f-canvas>
    <div |:|fDragHandle|:| fNode [fNodePosition]="{ x: 100, y: 200 }"></div>
  </f-canvas>
</f-flow>
```

#### Disabling Dragging

This code snippet shows how to disable dragging for a node.

```html
<f-flow fDraggable>
  <f-canvas>
    <div fDragHandle |:|[fNodeDraggingDisabled]="true"|:| fNode [fNodePosition]="{ x: 100, y: 200 }"></div>
  </f-canvas>
</f-flow>
```

#### Disabling Selection

This code snippet shows how to disable selection for a node.

```html
<f-flow fDraggable>
  <f-canvas>
    <div fDragHandle |:|[fNodeSelectionDisabled]="true"|:| fNode [fNodePosition]="{ x: 100, y: 200 }"></div>
  </f-canvas>
</f-flow>
```

## Examples

#### Node with Position

This example demonstrates a node with a specified position.

::: ng-component <node-with-position-example></node-with-position-example>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node/node-with-position-example/node-with-position-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node/node-with-position-example/node-with-position-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node/node-with-position-example/node-with-position-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

#### Adding Dragging Functionality

This example demonstrates a node with dragging functionality.

::: ng-component <adding-dragging-functionality-example></adding-dragging-functionality-example>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node/adding-dragging-functionality-example/adding-dragging-functionality-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node/adding-dragging-functionality-example/adding-dragging-functionality-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node/adding-dragging-functionality-example/adding-dragging-functionality-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::
