---
toc: false
wideContent: true
summary: "Use @foblex/mutator for stronger history management in editors."
primaryKeyword: "angular undo redo state history example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Undo/Redo v2

## Description

This example demonstrates how to add undo and redo functionality to a flow-based diagram built with Foblex Flow. It uses [@foblex/mutator](https://github.com/Foblex/f-mutator), a lightweight state management utility for snapshots, history, and predictable state transitions.

Use this version when your editor already has enough state complexity that you want a dedicated history layer instead of ad hoc manual stacks.

## Example

::: ng-component <undo-redo-v2></undo-redo-v2> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/undo-redo-v2/undo-redo-v2.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/undo-redo-v2/undo-redo-v2.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/undo-redo-v2/undo-redo-v2.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## Installation

Before running this example, install the additional package:

```bash
npm install @foblex/mutator
```

## Practical tips

- Use [@foblex/mutator](https://github.com/Foblex/f-mutator) whenever your editor requires time-traveling operations.
- Keep the state flat and serializable.
- Group multiple actions into one `update()` call when they should be undone as a single step.
- Undo/redo can cover selections, canvas transforms, and custom node metadata, not only nodes and connections.

This version is a better fit for editors that already have complex state and need a more disciplined history model.

## Related examples

- [Undo/Redo](./examples/undo-redo)
- [AI Low-Code Platform Example](./examples/ai-low-code-platform)
