---
toc: false
wideContent: true
summary: "Create new connections by dragging between connectors."
primaryKeyword: "angular drag to connect example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Drag to Connect

## Description

This guide shows how to create connections between connectors using drag-and-drop interactions. It covers one of the core behaviors users expect in a real node editor: start from an output, move across the canvas, get visual feedback, and complete a valid connection on an input.

This is a foundational example for workflow builders, automation tools, and any editor where users define logic by wiring blocks together.

Once this interaction is reliable, it becomes much easier to layer validation, snapping, content, and routing behavior on top.

## Example

::: ng-component <drag-to-connect></drag-to-connect> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-connect/drag-to-connect.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-connect/drag-to-connect.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-connect/drag-to-connect.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## When to use it

- Build the first version of a workflow builder.
- Add interactive edge creation to a custom node editor.
- Validate whether your node and connector IDs are stable enough for real editing flows.

This example is also a good baseline before layering on connection rules, snapping, or reassignment.

## Related docs

- [Create Connection](./docs/f-connection-for-create-component)
- [Output Connector](./docs/f-node-output-directive)
- [Input Connector](./docs/f-node-input-directive)
