---
title: "Angular Diagram Library"
description: "Use Foblex Flow as an Angular diagram library when you need interactive diagrams with a simple starting path and room for richer graph behavior."
summary: "Why Foblex Flow is a strong fit for interactive Angular diagrams that may start small and grow later."
primaryKeyword: "angular diagram library"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Angular Diagram Library

Foblex Flow is not a charting package or a static SVG helper. It is an **Angular diagram library for interactive, editable graph UIs**. That matters when your users are not just viewing relationships, but actively creating, connecting, moving, and organizing diagram elements.

You can still start small. A simple diagram editor only needs the core flow primitives, while features like minimap, waypoints, alignment, caching, virtualization, or worker-assisted rendering stay optional.

## When to use it

Use it for Angular diagram interfaces such as:

- custom architecture diagrams,
- UML or domain-specific modeling tools,
- relationship editors,
- interactive system maps,
- large canvases with draggable connected elements.

## Why it differs from generic diagram widgets

- The core path is small enough for normal Angular product screens, not only advanced graph tools.
- Nodes can contain real Angular UI, not only labels and icons.
- Connections are first-class and support markers, content, and editable routing.
- Users get editor behaviors such as zoom, selection, minimap, and snapping.
- You can define domain-specific rules instead of accepting a fixed diagram grammar.

## Key capabilities

- Node, group, connector, and connection primitives
- Multiple connection types and explicit routing controls
- Magnetic alignment and spacing helpers
- Connection waypoints for manual path shaping
- Programmatic viewport controls for large diagrams

## Related docs and examples

- [UML Diagram Example](./examples/uml-diagram-example)
- [Dagre Layout Example](./examples/dagre-layout)
- [ELKJS Layout Example](./examples/elkjs-layout)
- [Connection Waypoints Example](./examples/connection-waypoints)
- [Background Docs](f-background-component)

## GitHub and install

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

If you need a diagram surface that still behaves like an Angular product screen, Foblex Flow is a better fit than a static renderer.
