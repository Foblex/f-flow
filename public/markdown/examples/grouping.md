# Grouping

## Description

Learn how to group nodes in Foblex Flow, organize nested structures, and use smart geometry features like fIncludePadding, fAutoSizeToFitChildren, and fAutoExpandOnChildHit for dynamic, responsive diagrams in Angular.

#### Overview

Grouping helps structure complex diagrams by combining related nodes into logical blocks. Groups can be moved as a whole, resized dynamically, and used to manage nested structures. This example demonstrates:
- how to create groups (fGroup) and nest them inside each other;
- how to place nodes inside groups (including node-in-node nesting);
- how to control geometry with:
- fIncludePadding — include inner paddings when calculating bounds,
- fAutoSizeToFitChildren — auto-resize the group to fit its children,
- fAutoExpandOnChildHit — expand the group automatically when children hit the borders.

It also shows how groups can have inputs/outputs like regular nodes, and how connections route accordingly.

#### When to use

- You want to move several related nodes as a single unit.
- You need to visually separate subsections of a pipeline or editor.
- The group should automatically resize to wrap its content.
- Groups should dynamically expand when children are dragged toward the border.

## Example

::: ng-component <grouping></grouping> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/grouping/grouping.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/grouping/grouping.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/grouping/grouping.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::



