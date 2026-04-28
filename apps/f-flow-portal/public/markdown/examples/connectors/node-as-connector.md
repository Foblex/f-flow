---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Node as Connector

## Description

This example shows how to make a node behave as a connector instead of treating connectors as separate small handles only. That pattern is useful when the whole node, or a large region of it, should act like an interactive connection target.

It works well in compact editors, visual programming interfaces, and slot-based builders where dedicated tiny ports would make the UI harder to use. By letting the node itself participate in connection logic, you can keep the layout simpler without losing graph capabilities.

This is less about appearance and more about interaction design. Sometimes the best port is not a tiny port at all.

## Example

::: ng-component <node-as-connector></node-as-connector> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/node-as-connector/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/node-as-connector/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/node-as-connector/example.scss
:::

## When to use it

- Build compact node editors with fewer small hit targets.
- Support connection models where the whole node is conceptually a port.
- Simplify UX for touch, tablet, or dense graph interfaces.

Use this approach when explicit micro-connectors make the product harder to understand or harder to operate.

## Related docs

- [Node Directive](./docs/f-node-directive)
- [Node Input Directive](./docs/f-node-input-directive)
- [Node Output Directive](./docs/f-node-output-directive)
- [Connector Inside Node Example](./examples/connector-inside-node)
