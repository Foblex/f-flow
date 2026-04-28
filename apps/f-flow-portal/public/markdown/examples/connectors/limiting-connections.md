---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Limiting Connections

## Description

This example shows how to limit the number of connections that a connector, port, or node can accept. Connection limits are one of the simplest ways to keep a graph editor aligned with product rules instead of allowing arbitrary wiring.

That is important in workflow builders, API mappers, and logic tools where one input may accept only one source, while another port may support many outbound connections. Without guardrails, users can create invalid states that are harder to explain and harder to repair.

A clear connection limit usually improves UX because it makes the editor behave like the product domain, not like a blank canvas.

## Example

::: ng-component <limiting-connections></limiting-connections> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/limiting-connections/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/limiting-connections/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/limiting-connections/example.scss
:::

## When to use it

- Enforce one-to-one or one-to-many connection rules.
- Prevent invalid graph states before they reach backend validation.
- Keep complex diagrams readable and easier to debug.

This example is a good starting point when your nodes need structural rules, not just visual freedom.

## Related docs

- [Connection Rules](./docs/connection-rules)
- [Node Input Directive](./docs/f-node-input-directive)
- [Node Output Directive](./docs/f-node-output-directive)
- [Connector Outlet Example](./examples/connector-outlet)
