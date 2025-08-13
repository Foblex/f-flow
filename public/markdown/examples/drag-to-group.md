# Drag to Group

## Description

This example demonstrates how to group elements by dragging them into containers.

Groups can be nested inside other groups, and nodes can be placed inside groups or other nodes, with no limit to the nesting depth.
The only restriction is that groups cannot be placed inside nodes.

New nodes can be created directly inside a group or node by dragging them from the external palette [fExternalItem](add-node-from-palette).

When fIncludePadding is enabled, a child node or group cannot cross the parent’s padding area,
while with the option disabled, the restriction applies only to the container’s outer boundaries.

Inputs: fGroupId, fGroupParentId, fNodeId, fNodeParentId, fIncludePadding, fGroupPosition, fGroupSize, fNodePosition, fResizeHandleType
Outputs: fDropToGroup, fCreateNode

## Example

::: ng-component <drag-to-group></drag-to-group> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-to-group/drag-to-group.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-to-group/drag-to-group.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-to-group/drag-to-group.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::



