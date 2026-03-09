---
title: "Angular Node Editor Library"
description: "Build Angular node editors with Foblex Flow using a small starting path, then add richer interaction patterns only when you need them."
summary: "A practical guide to using Foblex Flow as an Angular node editor library without starting from an overly complex setup."
primaryKeyword: "angular node editor library"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Angular Node Editor Library

If your product needs a **node editor in Angular**, Foblex Flow gives you the low-level editor primitives without locking you into a fixed domain model. You render the node templates, define the graph semantics, and keep business logic in your application while the library handles interaction and drawing.

The core setup is small, so it is a practical default choice for Angular teams. Most editors start with nodes, connectors, and connections, then add minimap, grouping, alignment, or performance helpers later.

## When to use it

Choose Foblex Flow for node editors such as:

- rules and condition builders,
- internal operations tools,
- call routing editors,
- AI pipeline or agent builders,
- visual back-office configuration tools.

## Why teams choose Foblex Flow

- **Simple first step**: build a working editor with a small set of Angular-native primitives.
- **Custom nodes**: render anything inside a node, from forms to metrics to action toolbars.
- **Editable connections**: create, reassign, validate, and decorate edges.
- **Editor UX**: selection, zoom, minimap, guides, snapping, grouping, and drag handles.
- **Angular fit**: standalone components, template-driven composition, and SSR-aware setups.

## What you still own

Foblex Flow is not a full application builder. Your Angular app still owns:

- node metadata and connection rules,
- persistence and backend sync,
- role-based permissions,
- schema validation,
- custom actions and side panels.

That split is intentional. It keeps the editor flexible and avoids forcing a generic JSON format onto real product logic.

## Related docs and examples

- [Custom Nodes Example](./examples/custom-nodes)
- [Drag to Connect Example](./examples/drag-to-connect)
- [Connection Rules Example](./examples/connection-rules)
- [Node Directive Docs](f-node-directive)
- [Connection Component Docs](f-connection-component)

## GitHub and install

```bash
ng add @foblex/flow
```

Use the [examples overview](./examples/overview) to compare patterns and start from the closest editor use case.
