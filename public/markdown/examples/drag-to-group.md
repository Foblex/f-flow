# Drag to Group

## Description

Drag nodes into groups in Foblex Flow, create nested hierarchies, and build dynamic structures with auto-sizing, padding, and drop events in Angular.

#### Overview

This example shows how elements (nodes or groups) can be grouped simply by dragging them into containers. It demonstrates a flexible approach to building hierarchical structures in Foblex Flow, where groups can contain groups, and nodes can be nested inside groups or even other nodes.

The only restriction is that groups cannot be placed inside nodes, ensuring a consistent parent–child model.

You can also create new nodes directly inside a container by dragging them from an external palette using the fExternalItem directive.

The example introduces key behaviors such as respecting padding boundaries (fIncludePadding), automatically resizing groups to fit their children (fAutoSizeToFitChildren), and expanding groups on collision with children (fAutoExpandOnChildHit).

#### Key features in this demo
- Drag-to-group interaction
Move nodes or groups into another group by dragging. Parent/child relations update automatically.
- Nested structures
Groups can be nested inside other groups, and nodes can be nested without limit (node → node → node).
- External palette integration
Dragging from an external panel (fExternalItem) creates a new node directly inside a group or node.
- Geometry options
- fIncludePadding: children cannot overlap the parent’s padding area.
- fAutoSizeToFitChildren: parent resizes to wrap its children.
- fAutoExpandOnChildHit: parent expands dynamically when children collide with its borders.
- Dynamic creation & grouping

Events:

- fDropToGroup: emitted when an element is dropped into a group.
- fCreateNode: emitted when a new node is created via drag from the palette.

#### Practical tips
- Use fDropToGroup to implement custom logic when reorganizing hierarchy.
- Combine external palettes with fCreateNode for drag-and-drop editors that let users spawn nodes inside any container.
- Turn on Auto Expand for the best UX in editors where resizing groups manually would slow down the flow.
- Nesting is unlimited, but avoid putting groups inside nodes (not supported).

## Example

::: ng-component <drag-to-group></drag-to-group> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-to-group/drag-to-group.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-to-group/drag-to-group.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-to-group/drag-to-group.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::



