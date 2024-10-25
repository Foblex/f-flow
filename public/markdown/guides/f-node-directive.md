# Node

**Selector:** [fNode] 

The **FNodeDirective** is a directive that represents a node within a flow of elements. It is capable of interacting with other nodes and connectors, and can be dynamically positioned and styled.

## Inputs

  - `fNodeId: string;` The unique identifier for the directive instance. Automatically generated. Default: `f-node-${uniqueId++}`

  - `fNodePosition: IPoint;` Sets the position of the node. Redraws the node when the position changes.

  - `fNodeSize: IRect;` Sets the size of the node. Redraws the node when the size changes. Use the [fResizeHandle](f-resize-handle-directive) directive to resize the node.

  - `fNodeDraggingDisabled: boolean;` Indicates whether the node cannot be dragged. Default: `false`

  - `fNodeSelectionDisabled: boolean;`  Indicates whether the node cannot be selected. Default: `false`

## Outputs

 - `fNodePositionChange: EventEmitter<IPoint>;` Emits an event when the position of the node changes.  

 - `fNodeSizeChange: EventEmitter<IRect>;` Emits an event when the size of the node changes using the [fResizeHandle](f-resize-handle-directive) directive.

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
