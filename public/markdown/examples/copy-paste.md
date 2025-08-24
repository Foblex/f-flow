# Cut, Copy, and Paste Example

## Description

Learn how to implement copy, cut, and paste functionality in Foblex Flow.
This example shows how to duplicate nodes (with their connections), remove selected elements, and insert them back into the diagram — all while maintaining consistent IDs and connections.

#### Overview

Copy/Paste makes your editor much more user-friendly, enabling workflows similar to standard desktop applications. In this example you will learn:
- How to copy selected nodes (and their internal connections) into a clipboard.
- How to cut nodes: copy them to the clipboard and remove them (along with their connections) from the diagram.
- How to paste: insert clipboard content back into the diagram with new IDs and a slight offset, so copies don’t overlap with the originals.
- How to manage connections so they are only pasted if both source and target nodes are included in the clipboard.
- How to update node positions and reassign connections correctly when pasting.

Clipboard content is stored in a local signal, and IDs are regenerated using generateGuid() to keep the graph consistent.

#### When to use
- You want to provide users with familiar cut / copy / paste interactions.
- Your editor needs to support quick duplication of nodes and their connections.
- You want to allow structural edits (e.g., reorganizing flows by copy-pasting parts of a diagram).

## Example

::: ng-component <copy-paste></copy-paste> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/copy-paste/copy-paste.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/copy-paste/copy-paste.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/copy-paste/copy-paste.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

