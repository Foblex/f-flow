---
origin: "https://medium.com/@shuzarevich/foblex-flow-v18-1-0-magnetic-plugins-ai-low-code-platform-example-and-a-major-docs-refresh-1182c7e7fde1"
originLabel: "Originally published on Medium"
title: "Foblex Flow v18.1.0 Magnetic Plugins, AI Low-Code Platform Example, and a Major Docs Refresh"
description: "Foblex Flow is an Angular library for building node-based editors: flows, diagrams, visual builders-with a focus on interactive UX and clean APIs."
ogType: "article"
twitterCard: "summary_large_image"
---

Foblex Flow is an Angular library for building node-based editors: flows, diagrams, visual builders-with a focus on interactive UX and clean APIs.

Today I’m shipping **v18.1.0**. This release adds **two new magnetic alignment plugins**, a **new AI Low-Code Platform example**, and a **big documentation overhaul** (new pages + improved existing docs).

### ✨ Highlights

- 🧲 **Magnetic alignment plugins**: new **Magnetic Lines** and **Magnetic Rects** to help align elements while moving.
- 🤖 **New example: AI Low-Code Platform** -a larger, “real-world” demo showing how to build a production-like node editor experience.
- 📚 **Docs refresh**: new documentation pages + reworked existing guides for consistency, clarity, and better quick-start sections.

### 🧲 New: Magnetic Alignment Plugins

Alignment is one of those features that immediately makes an editor feel “professional”.

In v18.1 there are **two new plugins** you can enable depending on the UX you want.

### Magnetic Lines (Line Alignment)

This plugin adds guideline-like alignment behavior (snap/assist) while dragging.

::: ng-component <magnetic-lines></magnetic-lines> [height]="600"
:::

- You move an element close to a virtual guide line
- the editor helps you “lock” into that alignment
- you get a clean, predictable layout without pixel-hunting

✅ Live demo: <https://flow.foblex.com/examples/magnetic-lines>

> _Note: this is the next step of the old “Line Alignment” direction. If you used the previous approach - this is the cleaner, dedicated plugin version._

### Magnetic Rects

This plugin focuses on **bounds-based alignment**:

::: ng-component <magnetic-rects></magnetic-rects> [height]="600"
:::

you align element rectangles against other elements’ bounds (edges/centers).

- Helps with spacing, clean rows/columns
- Feels closer to how design tools behave
- Great for diagram builders where visual order matters

✅ Live demo: <https://flow.foblex.com/examples/magnetic-rects>

Both plugins ship with dedicated examples and documentation updates.

### 🤖 New example: AI Low-Code Platform

I also added a new larger example: **AI Low-Code Platform**.

::: ng-component [url]="https://foblex.github.io/Building-AI-Low-Code-Platform5/" [height]="700"
:::

✅ Live demo: <https://foblex.github.io/Building-AI-Low-Code-Platform5/>

✅ Source code: <https://github.com/Foblex/Building-AI-Low-Code-Platform5>

This example is meant as a **reference implementation** for building “production-like” editors with Foblex Flow:

- **Undo/redo** as the baseline safety net while editing
- **Import/Export to JSON** (share flows, version them, move between machines)
- **4 themes** with runtime switching
- **localStorage persistence** (state + settings)
- **animated connections** to make data flow readable
- **multi-selection** for batch operations
- **node configuration panel** per node with validation
- UI built with **Angular Material**

If you’re building a serious editor and want to see how the pieces fit together - this demo is the best starting point right now.

### 📚 Documentation update (major)

This release includes a large documentation pass.

### New docs pages

- <https://flow.foblex.com/docs/event-system>
- <https://flow.foblex.com/docs/selection-system>
- <https://flow.foblex.com/docs/f-drag-handle-directive>
- <https://flow.foblex.com/docs/f-group-directive>
- <https://flow.foblex.com/docs/f-resize-handle-directive>
- <https://flow.foblex.com/docs/f-rotate-handle-directive>
- <https://flow.foblex.com/docs/connection-rules>
- <https://flow.foblex.com/docs/f-connection-marker-directive>
- <https://flow.foblex.com/docs/f-snap-connection-component>
- <https://flow.foblex.com/docs/f-connection-waypoints-component>
- <https://flow.foblex.com/docs/f-external-item-directive>
- <https://flow.foblex.com/docs/f-selection-area-component>
- <https://flow.foblex.com/docs/f-magnetic-lines-component>
- <https://flow.foblex.com/docs/f-magnetic-rects-component>

### Improved existing guides

- <https://flow.foblex.com/docs/f-flow-component>
- <https://flow.foblex.com/docs/f-canvas-component>
- <https://flow.foblex.com/docs/f-node-directive>
- <https://flow.foblex.com/docs/f-node-output-directive>
- <https://flow.foblex.com/docs/f-node-input-directive>
- <https://flow.foblex.com/docs/f-node-outlet-directive>
- <https://flow.foblex.com/docs/f-connection-component>
- <https://flow.foblex.com/docs/f-connection-for-create-component>
- <https://flow.foblex.com/docs/f-draggable-directive>
- <https://flow.foblex.com/docs/f-zoom-directive>
- <https://flow.foblex.com/docs/f-background-component>
- <https://flow.foblex.com/docs/f-minimap-component>

If you haven’t checked the docs in a while - it’s worth revisiting.

The goal of this refresh is simple: **less guessing, faster onboarding, more consistent terminology**.

### ✅ Release links

- Release: <https://github.com/Foblex/f-flow/releases/tag/v18.1.0>
- Magnetic Lines demo: <https://flow.foblex.com/examples/magnetic-lines>
- Magnetic Rects demo: <https://flow.foblex.com/examples/magnetic-rects>
- AI Low-Code Platform demo: <https://foblex.github.io/Building-AI-Low-Code-Platform5/>

### Closing

Magnetic alignment is one of those features that changes the feel of the editor immediately-things become cleaner, faster, and more intentional.

If you’re building a visual editor in Angular and want a native Angular solution (not a React wrapper)-take a look.

And if you like what I’m building, please consider starring the repo ⭐️

It helps the project a lot.

Repo: <https://github.com/Foblex/f-flow>
