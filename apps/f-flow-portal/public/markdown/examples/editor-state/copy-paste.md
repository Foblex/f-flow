---
toc: false
wideContent: true
---

# Cut, Copy, and Paste Example

## Description

Add familiar cut, copy, and paste interactions to a node editor while keeping IDs, offsets, and connections consistent. This pattern matters once users need to duplicate or reorganize larger graph fragments quickly.

## Example

::: ng-component <copy-paste></copy-paste> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/copy-paste/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/copy-paste/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/copy-paste/example.scss
:::

## What this example shows

- Copy selected nodes and the connections that stay valid inside the copied fragment.
- Cut nodes by copying them and then removing them from the diagram.
- Paste clipboard content with regenerated IDs and a slight position offset.
- Rebuild connections only when both source and target nodes exist in the pasted selection.

Clipboard content is stored in local state, and new IDs are generated during paste so the graph remains valid.

## When to use it

- Users expect desktop-like editing shortcuts.
- The editor needs fast duplication of nodes and their connections.
- Teams frequently reorganize parts of a workflow by reusing existing graph fragments.
