---
origin: "https://medium.com/@shuzarevich/foblex-flow-17-8-5-connectable-sides-for-smarter-routing-in-angular-36e49407b78a"
originLabel: "Originally published on Medium"
title: "Foblex Flow 17.8.5— Connectable Sides for Smarter Routing in Angular"
description: "Node-based editors are becoming the backbone of AI pipelines, workflow builders, and low-code platforms. With Foblex Flow , we bring this experience natively into Angular."
ogType: "article"
twitterCard: "summary_large_image"
---

Node-based editors are becoming the backbone of AI pipelines, workflow builders, and low-code platforms. With **Foblex Flow**, we bring this experience natively into Angular.

The new release, **v17.8.5**, introduces a major improvement:

✅ Fine-grained control over which side of a node is connectable (manual or calculated).

Together, these updates give developers precise control over routing while still supporting automatic, dynamic layouts.

✨ **Connectable Sides**

Connections are no longer limited to a single default side. Now, each connector can define exactly where links are allowed:

![](https://cdn-images-1.medium.com/max/1024/1*HWWQhq3K27BEpulOEqw12w.png)

![](https://cdn-images-1.medium.com/max/1024/1*mwesRS9iVglibX_ydFUSNA.png)

![](https://cdn-images-1.medium.com/max/1024/1*QY_wSupK6uRKuFvFClYFJg.png)

```
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

Demo — <https://flow.foblex.com/examples/connectable-side>

📚 **Other Improvements**

- AUTO mode for quick setup with default heuristics.
- Clearer routing logic, reducing edge overlaps in dynamic layouts.
- No breaking changes; previous side selection remains compatible.

💡 **Why This Matters**

Professional diagramming tools let you fine-tune how edges are routed.

Now, Foblex Flow brings the same level of control into Angular:

- **Manual control** when you want stable, predictable layouts.
- **Dynamic calculation** for adaptive editors.
- **Simple API** to cover most use cases without boilerplate.

🔗 **Links**

- GitHub repo: <https://github.com/Foblex/f-flow>
- Live examples: [https://flow.foblex.com/examples](https://flow.foblex.com/examples/overview)

❤️ If you find Foblex Flow useful, please ⭐ the repo on [GitHub](https://github.com/Foblex/f-flow) — it’s the best way to support the project and help it grow.
