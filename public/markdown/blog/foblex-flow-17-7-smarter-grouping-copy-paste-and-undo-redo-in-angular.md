---
origin: "https://javascript.plainenglish.io/foblex-flow-17-7-smarter-grouping-copy-paste-and-undo-redo-in-angular-9220bc65b961"
originLabel: "Originally published on JavaScript in Plain English"
title: "Foblex Flow 17.7 — Smarter Grouping, Copy/Paste, and Undo/Redo in Angular"
description: "Node-based editors are becoming a standard for automation, AI workflows, and low-code platforms. With Foblex Flow , we bring this power natively to Angular."
ogType: "article"
twitterCard: "summary_large_image"
---

### Foblex Flow 17.7 — Smarter Grouping, Copy/Paste, and Undo/Redo in Angular

Node-based editors are becoming a standard for automation, AI workflows, and low-code platforms. With [**Foblex Flow**](https://github.com/foblex/flow), we bring this power natively to Angular.

The new release, **v17.7.0**, introduces smarter grouping, copy/paste, and undo/redo — all features that make visual editors feel much closer to production-ready tools.

### ✨ Smarter Grouping

Working with groups is now more powerful and intuitive:

- **Auto-resize groups** with fAutoSizeToFitChildren.
- **Auto-expand groups** dynamically with fAutoExpandOnChildHit when children no longer fit inside.
- Refactored and improved examples:
- [Grouping Example](https://flow.foblex.com/examples/grouping)

::: ng-component <grouping></grouping> [height]="600"
:::

- [Drag-to-Group Example](https://flow.foblex.com/examples/drag-to-group)

::: ng-component <drag-to-group></drag-to-group> [height]="600"
:::

⚠️ **Breaking Change**

- CSS class .f-parent-for-drop → renamed to .f-grouping-over-boundary.
- Added .f-grouping-drop-active for valid grouping targets.

👉 If you use custom CSS for grouping, make sure to update your styles!

### 📋 Copy / Paste Example

We all use copy, cut, and paste every day. Now your node-based editors can too.

- New [**Copy-Paste Example**](https://flow.foblex.com/examples/copy-paste).
- Duplicate nodes (with their connections).
- Remove selected elements.
- Paste them back while maintaining consistent IDs and connections.

This example shows how easy it is to implement clipboard functionality directly with Foblex Flow.

### ⏪ Undo / Redo Example

No editor feels complete without Undo/Redo. With v17.7, you now have a reference implementation:

::: ng-component <undo-redo-v2></undo-redo-v2> [height]="600"
:::

- New [**Undo-Redo V2 Example**](https://flow.foblex.com/examples/undo-redo-v2).
- Powered by [**@foblex/mutator**](https://www.npmjs.com/package/@foblex/mutator).
- Tracks state changes, snapshots, and history.
- Enables true **time-travel editing** for your diagrams.

Undo/Redo creates a smoother and more interactive editing experience, and is often a must-have for production tools.

### 📚 Documentation Updates

We’ve refreshed the docs to reflect these improvements:

- [FNodeDirective](https://flow.foblex.com/docs/f-node-directive)
- [FFlowComponent](https://flow.foblex.com/docs/f-flow-component)
- [FCanvasComponent](https://flow.foblex.com/docs/f-canvas-component)

### Why This Matters

With these features, Foblex Flow becomes even more practical for real-world editors:

- **Grouping** makes complex diagrams easier to manage.
- **Copy/Paste** is expected by every user.
- **Undo/Redo** provides the safety net people need when building flows.

Together, they bring Angular-based visual editors closer to the standard set by professional design tools.

### 🔗 Links

- GitHub repo: <https://github.com/foblex/flow>
- Live examples: <https://flow.foblex.com/examples>

### ❤️ Support the Project

This release moves Foblex Flow another step closer to being a full-fledged framework for building low-code and AI editors in Angular.

If you find it useful, please ⭐ the repo on GitHub — it’s the best way to support the project and help it grow.
