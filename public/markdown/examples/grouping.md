---
toc: false
wideContent: true
---

# Grouping

## Description

Group related nodes into larger containers, build nested structures, and manage responsive geometry in Angular with Foblex Flow. This is a core pattern for editors that need logical sections instead of a flat list of nodes.

## Example

::: ng-component <grouping></grouping> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/grouping/grouping.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/grouping/grouping.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/grouping/grouping.scss
:::

## What this example shows

- Create groups with `fGroup` and nest them inside each other.
- Place nodes inside groups and build deeper structures when needed.
- Use `fIncludePadding`, `fAutoSizeToFitChildren`, and `fAutoExpandOnChildHit` to control container geometry.
- Route connections through groups that also expose their own inputs and outputs.

## When to use it

- Move several related nodes as one unit.
- Visually separate subsections of a workflow or editor.
- Auto-resize a container to fit its content.
- Expand groups dynamically while users drag children toward the border.
