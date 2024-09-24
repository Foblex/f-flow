# Drag Handle 

**Selector:** [fDragHandle] 

The **FDragHandle** is a directive that specifies the handle for dragging a node within a flow of elements. It is used in conjunction with the [fNode](f-node-directive) directive to enable dragging functionality.

## Styles
  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-drag-handle` Class specific to the drag handle directive, providing styles for the drag handle representation.

## Usage

#### Node with drag handle

We need to add the **fDragHandle** directive inside [fNode](f-node-directive) to specify the handle for dragging.
This can be any element inside the node that will act as the drag handle.

```html
<f-flow |:|fDraggable|:|>
  <f-canvas>
    <div fNode [fNodePosition]="{ x: 100, y: 200 }">
      <div |:|fDragHandle|:|>Node</div>
    </div>
  </f-canvas>
</f-flow>
```

#### Disabling Dragging

This code snippet shows how to disable dragging for a node.

```html
<f-flow fDraggable>
  <f-canvas>
    <div fNode |:|[fNodeDraggingDisabled]="true"|:| [fNodePosition]="{ x: 100, y: 200 }">
      <div fDragHandle>Node</div>
    </div>
  </f-canvas>
</f-flow>
```

## Examples

#### Node with Drag Handle

This example demonstrates how to use the **fDragHandle** directive to specify the handle for dragging a node.

::: ng-component <node-with-drag-handle-example></node-with-drag-handle-example>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node/node-with-drag-handle-example/node-with-drag-handle-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node/node-with-drag-handle-example/node-with-drag-handle-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/node/node-with-drag-handle-example/node-with-drag-handle-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::
