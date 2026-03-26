---
toc: false
wideContent: true
summary: "Use outlet connectors to control where edges leave a node in Angular graph UIs."
primaryKeyword: "angular connector outlet example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Connector Outlet

## Description

This example demonstrates how to use an outlet connector to control where connections leave a node. Outlet-based patterns are helpful when a node has multiple exit paths, multiple logical outputs, or a layout where edge routing needs a dedicated anchor.

In a real product, outlet connectors help keep graphs readable. Instead of attaching every edge to the same generic point, you can expose a clearer structure for branching, fan-out behavior, and more predictable routing.

This becomes important in workflow builders, automation editors, and low-code tools where users need to understand exactly how work moves from one step to the next.

## Example

::: ng-component <connector-outlet></connector-outlet> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-outlet/connector-outlet.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-outlet/connector-outlet.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-outlet/connector-outlet.component.scss
:::

## What this solves

- Cleaner fan-out from a single node.
- More explicit exit points for branching logic.
- Better readability when many edges leave the same step.

If your nodes represent actions, conditions, or service calls with multiple outcomes, outlet connectors are usually a better fit than a single shared port.

## Related docs

- [Node Outlet Directive](./docs/f-node-outlet-directive)
- [Connection Component](./docs/f-connection-component)
- [Connection Rules](./docs/connection-rules)
- [Limiting Connections Example](./examples/limiting-connections)
