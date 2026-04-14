---
title: "Angular Node-Based UI Library"
description: "Foblex Flow is an Angular-native node-based UI library for teams that want to start simple in Angular and grow into richer graph interfaces later."
summary: "Use Foblex Flow when you need Angular-native graph UI primitives with a simple starting path and room to grow."
primaryKeyword: "angular node-based ui library"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Angular Node-Based UI Library

Foblex Flow is an **Angular-native node-based UI library** for building interfaces where users edit connected entities visually. It gives you the rendering and interaction layer for **node editors**, **workflow builders**, **visual automation tools**, **AI pipeline builders**, and other graph-style product surfaces.

The starting path is small: `f-flow`, `f-canvas`, nodes, connectors, and connections. Most teams add helpers like minimap, selection area, snapping, caching, or virtualization only later.

## When to use it

Use Foblex Flow when your Angular application needs users to:

- place and move nodes on a canvas,
- create or reassign connections,
- zoom, pan, select, and align elements,
- apply domain rules while keeping the graph model in app state,
- build a custom editor instead of embedding a generic diagram widget.

## Why Angular-first matters

Many graph UI tools are React-first, or they bring their own store and conventions. Foblex Flow takes a different approach:

- the rendering primitives are built for Angular templates and Angular change detection,
- the library stays compatible with SSR-friendly setups,
- your application keeps ownership of data, validation, permissions, and persistence,
- you can compose the editor with your own services, signals, RxJS streams, or NgRx state.

## Key capabilities

- `f-flow` and `f-canvas` as the editor root and viewport.
- Nodes, connectors, groups, and persisted connections.
- Drag-to-connect, drag-to-reassign, box selection, zoom, minimap, snapping, and waypoints.
- Helper plugins such as Magnetic Lines and Magnetic Rects for cleaner layouts.
- A UI-agnostic foundation that works with Angular Material or your own design system.

## Related docs and examples

- [Get Started](get-started)
- [Flow](f-flow-component)
- [Drag and Drop](f-draggable-directive)
- [AI Low-Code Platform Example](./examples/ai-low-code-platform)
- [UML Diagram Example](./examples/uml-diagram-example)

## GitHub and install

Start with:

```bash
ng add @foblex/flow
```

For Nx workspaces:

```bash
nx g @foblex/flow:add
```

Or install it manually with the required companion packages:

```bash
npm install @foblex/flow @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

Then explore the [GitHub repository](https://github.com/Foblex/f-flow) for source code, examples, and release notes.
