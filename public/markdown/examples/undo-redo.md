---
toc: false
wideContent: true
summary: "Add history controls so users can revert diagram edits."
primaryKeyword: "angular undo redo example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Undo/Redo

## Description

This example demonstrates how to implement undo and redo functionality in a flow-based diagram. Undo and redo let users revert accidental changes, compare alternatives, and explore graph edits without fear of losing work.

If you are building a serious editor, history is not optional. It is one of the strongest signals that the interface is ready for repeated daily use instead of being only a demo.

Even a simple history model can dramatically improve trust in the editor and reduce user hesitation.
That is why it is one of the first production features many teams add.

## Example

::: ng-component <undo-redo></undo-redo> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/undo-redo/undo-redo.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/undo-redo/undo-redo.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/undo-redo/undo-redo.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## What this solves

- Revert node moves and connection changes.
- Make experimentation safe for end users.
- Provide a cleaner foundation for richer editor tooling later.

If your users edit flows repeatedly during the day, undo/redo quickly moves from “nice to have” to required product behavior.

## Related examples

- [Undo/Redo V2](./examples/undo-redo-v2)
- [AI Low-Code Platform Example](./examples/ai-low-code-platform)
