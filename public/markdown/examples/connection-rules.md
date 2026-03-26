---
toc: false
wideContent: true
summary: "Restrict which connectors can connect and show valid targets during drag."
primaryKeyword: "angular connection rules example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Connection Rules

## Description

This example demonstrates how to **control which input connectors can be connected** to a given output connector. The rules work in two ways:

- **By input ID** (`fInputId`)
- **By input category** (`fInputCategory`)

On the output side you define `fCanBeConnectedInputs`, which may include specific input IDs and/or categories. During a drag operation, the system checks whether the target input ID or category is present in that array and only then allows the connection.

## Example

::: ng-component <connection-rules></connection-rules> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connection-rules/connection-rules.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connection-rules/connection-rules.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connection-rules/connection-rules.scss
:::

## Visual feedback

When a connection starts being dragged:

- The container receives the CSS class `.f-connections-dragging`.
- Every input connector that can accept the connection gets the class `.f-connector-connectable`.
- Inputs without this class are treated as invalid targets and can be dimmed or styled differently.

This gives the user immediate feedback about which targets are valid before they complete the drag.

## When to use it

Use connection rules when your editor has domain constraints such as:

- one node type can connect only to a specific target,
- only certain categories of inputs are valid,
- the UI should show allowed targets before the user commits the connection,
- your application needs both better UX and cleaner graph data.

## Related docs

- [Connection Rules Docs](./docs/connection-rules)
- [Drag to Connect Example](./examples/drag-to-connect)
