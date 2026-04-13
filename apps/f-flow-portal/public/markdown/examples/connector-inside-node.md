---
toc: false
wideContent: true
summary: "Place connectors inside nodes to build compact Angular graph interfaces."
primaryKeyword: "angular connector inside node example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Connector Inside Node

## Description

This example shows how to place connectors inside a node instead of only on its outer border. That layout is useful when the node UI is dense and the connection point needs to sit next to a specific field, control, or logical slot.

It works especially well for builder-style interfaces where nodes contain forms, action rows, or embedded controls. In those cases, internal connector placement can make the relationship between a UI element and its connection point much clearer.

The main value is not visual novelty. It is better information architecture inside the node, which leads to cleaner routing and less confusion for users editing complex graphs.

## Example

::: ng-component <connector-inside-node></connector-inside-node> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/connector-inside-node/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/connector-inside-node/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/connector-inside-node/example.scss
:::

## When to use it

- Build compact node UIs with form-like or slot-based layouts.
- Keep ports close to the data or action they represent.
- Reduce visual clutter on larger, more detailed nodes.

This is a practical pattern for workflow builders and internal tools where node layout carries real meaning.

## Related docs

- [Node Directive](./docs/f-node-directive)
- [Node Input Directive](./docs/f-node-input-directive)
- [Node Output Directive](./docs/f-node-output-directive)
- [Connectable Side Example](./examples/connectable-side)
