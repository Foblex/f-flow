---
origin: "https://medium.com/@shuzarevich/foblex-flow-17-8-5-connectable-sides-for-smarter-routing-in-angular-36e49407b78a"
originLabel: "Originally published on Medium"
title: "Foblex Flow 17.8.5— Connectable Sides for Smarter Routing in Angular"
description: "Foblex Flow 17.8.5 adds connectable side controls so Angular teams can route node connections with more precision and less visual noise."
ogType: "article"
twitterCard: "summary_large_image"
summary: "Release notes for connectable side control in Foblex Flow 17.8.5."
primaryKeyword: "angular connection routing"
schemaType: "Article"
author: "Siarhei Huzarevich"
publishedAt: "2025-10-05"
updatedAt: "2026-03-08"
---

# Foblex Flow 17.8.5 — Connectable Sides for Smarter Routing in Angular

This release adds more precise control over where connections can attach to a node, which is especially useful in Angular workflow builders and diagram editors where routing clarity matters.

The new release, **v17.8.5**, introduces a major improvement:

✅ Fine-grained control over which side of a node is connectable (manual or calculated).

Together, these updates give developers precise control over routing while still supporting automatic, dynamic layouts.

## Connectable Sides

::: ng-component <connectable-side></connectable-side> [height]="600"
:::

Connections are no longer limited to a single default side. Now, each connector can define exactly where links are allowed:

```ts
export enum EFConnectableSide {
  LEFT = 'left',
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  CALCULATE = 'calculate',
  CALCULATE_HORIZONTAL = 'calculate_horizontal',
  CALCULATE_VERTICAL = 'calculate_vertical',
  AUTO = 'auto',
}
```

You can:

- **Fix a side** (e.g., input always on the left, output always on the right).
- **Calculate dynamically** (CALCULATE) — side is chosen based on relative positions of nodes.
- **Restrict calculation** to only horizontal (CALCULATE_HORIZONTAL) or vertical (CALCULATE_VERTICAL) axes.
- **Let the system decide fully** (AUTO).

📚 **Other Improvements**

- AUTO mode for quick setup with default heuristics.
- Clearer routing logic, reducing edge overlaps in dynamic layouts.
- No breaking changes; previous side selection remains compatible.

## Why This Matters

Professional diagramming tools let you fine-tune how edges are routed.

Now, Foblex Flow brings the same level of control into Angular:

- **Manual control** when you want stable, predictable layouts.
- **Dynamic calculation** for adaptive editors.
- **Simple API** to cover most use cases without boilerplate.

## Links

- GitHub repo: <https://github.com/Foblex/f-flow>
- Live examples: [https://flow.foblex.com/examples](https://flow.foblex.com/examples/overview)

❤️ If you find Foblex Flow useful, please ⭐ the repo on [GitHub](https://github.com/Foblex/f-flow) — it’s the best way to support the project and help it grow.
