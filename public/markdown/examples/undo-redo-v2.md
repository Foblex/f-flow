# Undo/Redo v2

## Description

This example demonstrates how to add undo and redo functionality to a flow-based diagram built with Foblex Flow.
Undo/redo gives users the ability to revert recent changes or reapply reverted actions, creating a smoother and more interactive editing experience.

The implementation is based on [@foblex/mutator](https://github.com/Foblex/f-mutator), a lightweight state management utility that tracks state changes, snapshots, and history. With it, you can maintain a stack of operations and easily implement time-travel behavior inside your editor.

## Installation

Before running this example, install the additional package:

```bash
npm install @foblex/mutator
```

## Practical tips
- Use [@foblex/mutator](https://github.com/Foblex/f-mutator) whenever your editor requires time-traveling operations.
- Keep the state flat and serializable (no cyclic refs, functions, or DOM nodes).
- Group multiple actions into one update() call when they should be undone as a single step.
- Undo/redo is not limited to nodes and connections — you can also manage selections, canvas transforms, or custom properties.

## Example

::: ng-component <undo-redo-v2></undo-redo-v2> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/undo-redo-v2/undo-redo-v2.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/undo-redo-v2/undo-redo-v2.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/undo-redo-v2/undo-redo-v2.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

