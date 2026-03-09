---
toc: false
wideContent: true
---

# Drag to Group

## Description

Drag nodes or groups into containers, build nested hierarchies, and manage dynamic parent-child structures in Angular with Foblex Flow. Use this pattern when your editor needs more than a flat canvas and grouping should feel like a first-class interaction.

## Example

::: ng-component <drag-to-group></drag-to-group> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-to-group/drag-to-group.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-to-group/drag-to-group.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/drag-to-group/drag-to-group.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## What this example shows

- Move nodes or groups into another group and update parent-child relations through drag-and-drop.
- Nest groups inside groups and nodes inside other containers when the editor needs hierarchy.
- Create new nodes directly inside a target container via `fExternalItem`.
- Control container geometry with `fIncludePadding`, `fAutoSizeToFitChildren`, and `fAutoExpandOnChildHit`.
- React to reorganization events through `fDropToGroup` and `fCreateNode`.

## Practical tips

- Use `fDropToGroup` when your app needs to validate or persist hierarchy changes.
- Combine external palettes with `fCreateNode` if users should spawn nodes directly inside any container.
- Enable auto-expand when manual group resizing would slow down editing.
- Nesting can go deep, but groups inside nodes are still not supported.
