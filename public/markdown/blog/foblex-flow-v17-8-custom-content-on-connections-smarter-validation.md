---
origin: "https://medium.com/@shuzarevich/foblex-flow-17-8-custom-content-on-connections-and-smarter-validation-in-angular-4a9bc7129d86"
originLabel: "Originally published on Medium"
title: "Foblex Flow 17.8 — Custom Content on Connections and Smarter Validation in Angular"
description: "Node-based editors are becoming the backbone of AI pipelines, workflow builders, and low-code platforms. With Foblex Flow , we bring this experience natively into Angular."
ogType: "article"
twitterCard: "summary_large_image"
---

### Foblex Flow 17.8 — Custom Content on Connections and Smarter Validation in Angular

Node-based editors are becoming the backbone of AI pipelines, workflow builders, and low-code platforms. With **Foblex Flow**, we bring this experience natively into Angular.

The new release, **v17.8.0**, introduces two major improvements:

✅ **Custom content inside connections**

✅ **Smarter validation rules for allowed connections**

Together, these make visual editors more flexible, user-friendly, and production-ready.

✨ **Custom Content on Connections**

![](https://cdn-images-1.medium.com/max/1024/1*wW8qCQaR8F8RxhEFZ3dYcw.png)

Connections are no longer just lines — you can now place any custom widget directly on them.

With the new fConnectionContent directive, you can:

- Add **labels, icons, or buttons** at any point along a connection.
- Control **position (0..1)**, **offset (px)**, and **alignment** relative to the path.
- Use multiple content elements on the same connection.

Example:

```
<f-connection ...>
  <button fConnectionContent [position]="0.25" [offset]="-12">+</button>
  <span fConnectionContent [position]="0.75" align="along">⮕</span>
</f-connection>
```

This enables interaction patterns like inline buttons, directional icons, or status indicators **directly on edges**.

🔒 **Smarter Connection Validation**

![](https://cdn-images-1.medium.com/max/1024/1*e88tuPSnChdoFE8zOhic9A.png)

Validation rules got a big upgrade.

Previously, connections could only be restricted by **input ID**.

Now you can also define restrictions by **input category** (fInputCategory).

On the output side, you specify an array fCanBeConnectedInputs, which may include both:

- explicit IDs
- or categories (labels like “math”, “string”, “number”).

During a drag operation:

- Only valid inputs are highlighted with .f-connector-connectable.
- Invalid inputs stay dimmed.
- The container gets .f-connections-dragging for styling.

This gives **instant visual feedback** and allows real editors to enforce rules like “math nodes can only connect to math inputs”.

⚠️ **Deprecations**

Two older APIs are now deprecated:

- fConnectionCenter directive
- fText property

They are replaced by the new fConnectionContent directive. Migration is simple — see the [changelog](https://github.com/foblex/flow/releases/tag/v17.8.0).

📚 **Other Improvements**

- Refactored Dagre layout example with better connection handling.
- Connector IDs migrated to Angular Signals for improved reactivity.
- Infrastructure update: added **chokidar** for file watching.
- Angular dependencies updated to latest patch versions.

💡 **Why This Matters**

These features move Foblex Flow closer to the UX of professional diagramming tools:

- **Content on connections** makes diagrams informative and interactive.
- **Validation by category** keeps flows correct and safe.
- **Deprecations** streamline the API for future growth.

Foblex Flow continues to evolve into a **production-ready Angular framework for low-code editors, AI builders, and workflow tools**.

🔗 **Links**

- GitHub repo: <https://github.com/foblex/flow>
- Live examples: [https://flow.foblex.com/examples](https://flow.foblex.com/examples/overview)

❤️ If you find it useful, please ⭐ the repo on GitHub — it’s the best way to support the project and help it grow.
