---
toc: false
wideContent: true
summary: "Tournament bracket example built on top of the same graph primitives."
primaryKeyword: "angular tournament bracket example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Tournament Bracket

## Example

This example demonstrates how to use Foblex Flow to create a tournament bracket in Angular. It is a good reminder that the library is not limited to classic workflow builders: the same graph primitives can be adapted to sports, competition, and tree-style interfaces.

::: ng-component <tournament-bracket></tournament-bracket> [height]="600"
:::

## What this shows

- Canvas navigation for a larger bracket structure.
- Zoom interactions using the [fZoom](./docs/f-zoom-directive) directive.
- A custom domain layout built on top of general node-and-connection primitives.

It is a good reference when you want to apply the library to a domain that is not a classic workflow builder but still behaves like a connected graph.

That makes it a useful showcase for teams considering Foblex Flow beyond standard automation or low-code interfaces.
It demonstrates reuse of the same primitives in a very different domain model.

## Source Code

The source code for this example can be found in the [GitHub repository](https://github.com/Foblex/f-flow/tree/main/projects/f-pro-examples).
