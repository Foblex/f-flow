# Drag Handle

## Description

This example showcases how to add a [DragHandle](./docs/f-drag-handle-directive) for nodes, allowing users to move them easily within Angular and Foblex Flow.

The `fDragHandle` directive can be applied to any HTML element inside a node `fNode`. It defines which part of the node should respond to drag gestures. This enables you to:
-	Make the entire node draggable
-	Limit dragging to a specific element like an icon, header, or image
-	Build flexible and intuitive drag behavior for custom UIs

#### How to Handle Position Changes

To track and persist node positions, you should handle the `fNodePositionChange` event emitted by each node. This event returns a new position of the node `{ x: number, y: number }` whenever it is moved.

You can use this event to:
-	Save the new position to a model or store
-	Sync changes to a backend or local storage
-	Trigger layout adjustments or constraints

In addition, the `fMoveNodes` event emitted by `<f-flow>` is triggered whenever one or more nodes are moved, including single-node moves.
It provides an array of updated nodes, each with its new position, making it ideal for:

-	Tracking bulk movements (e.g., group drag)
-	Implementing `undo/redo` systems
-	Managing external logic like snapping or alignment

## Example

::: ng-component <drag-handle></drag-handle> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-handle/drag-handle.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-handle/drag-handle.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-handle/drag-handle.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::


