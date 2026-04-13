---
toc: false
wideContent: true
summary: "Customize how different connection types behave in the same Angular graph editor."
primaryKeyword: "angular connection behaviors example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Connection Behaviours

## Description

This example demonstrates how to apply different behaviors to different connections in the same Angular node editor. Not every edge in a product should behave the same way: some connections may snap aggressively, some may stay constrained, and some may need their own hover or rerouting rules.

This matters once your diagram is more than a visual demo. Workflow builders, logic editors, and domain-specific graph tools often need edge behavior that depends on the source node, target node, or the meaning of that connection.

Treating connection behavior as part of product logic usually gives a better result than trying to force every edge into one generic interaction model.

## Example

::: ng-component <connection-behaviours></connection-behaviours> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/connection-behaviours/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/connection-behaviours/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/connection-behaviours/example.scss
:::

## What this solves

- Different interaction rules for different connection types.
- Cleaner UX for mixed diagrams with strict and flexible edges.
- A clearer path from generic diagrams to domain-specific editors.

Use this pattern when your graph UI needs more than a single default connection behavior.

## Related docs

- [Connection Component](./docs/f-connection-component)
- [Snap Connection Component](./docs/f-snap-connection-component)
- [Connection Rules](./docs/connection-rules)
- [Connection Types Example](./examples/connection-types)
