---
origin: "https://javascript.plainenglish.io/call-center-flow-editor-now-updated-with-angular-20-signals-3f10ae63ffa0"
originLabel: "Originally published on JavaScript in Plain English"
title: "Call Center Flow Editor — now updated with Angular 20 & Signals"
description: "About a year ago I shared a small side project: a call center flow editor built on top of Foblex Flow ."
ogType: "article"
twitterCard: "summary_large_image"
---

![](https://cdn-images-1.medium.com/max/1024/1*iXc5ysiX_VEXlnDXO2eQCg.png)

### Call Center Flow Editor — now updated with Angular 20 & Signals 🚀

About a year ago I shared a small side project: a **call center flow editor** built on top of [Foblex Flow](https://github.com/Foblex/f-flow).

The idea was simple — give users a way to design call flows visually by dragging nodes and connecting them, instead of writing configuration manually.

Since then, Angular has evolved, and so has this project. I wanted to take advantage of **Angular 20** and its new **Signals API**, so I decided to give the editor a proper refresh.

### 🔥 What’s New

Here’s what changed in this update:

- Migrated the whole project to **Angular 20**
- Rewritten state management on **Signals** → no external store, simpler and more reactive
- Added a **Light/Dark theme switch** for a nicer editing experience
- Added **Undo/Redo** (finally you can experiment without fear)
- Improved overall UX (zooming, dragging and reconnecting nodes feels smoother)
- Using **Angular Material components** for the interface

![](https://cdn-images-1.medium.com/max/800/1*HtMSYbDxgGCY2orxw9BEkg.gif)

Call Center Flow

### Demo & Source

👉 [Live Demo](https://foblex.github.io/f-flow-example)

👉 [Source Code](https://github.com/Foblex/f-flow-example)

⭐ [Library: Foblex Flow](https://github.com/Foblex/f-flow)

### Reflections

Moving everything to **Signals** simplified the state logic a lot. Undo/redo was much easier to wire up, and persisting state in localStorage became almost trivial.

This was a good reminder that Angular’s ecosystem is evolving quickly — and Signals are already powerful enough to drive fairly complex interactive UIs.

### Closing Thoughts

This project started as a small experiment, but it keeps evolving together with Angular. Signals made the code simpler and the editor itself more responsive.

I’m planning to keep polishing it, so feedback is always welcome 🙌

👉 Try the demo: <https://foblex.github.io/f-flow-example>

And if you find this project useful, consider leaving a ⭐ on [GitHub](https://github.com/Foblex/f-flow) — it really helps!
