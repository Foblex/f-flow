# Introducing Foblex Flow

## Description

Foblex Flow is an **Angular-native** library for building interactive **node-based editors** and diagram UIs - custom nodes, smooth connections, and production-grade interaction helpers.

It’s designed for real products where users edit graphs manually: dragging nodes, connecting ports, selecting multiple items, aligning layouts, and navigating large canvases.

The core path is intentionally small: `f-flow`, `f-canvas`, nodes, connectors, and connections. Advanced helpers such as selection area, minimap, alignment guides, caching, and virtualization are optional add-ons you introduce later if the editor grows.

**What you get**

- Core primitives for flow rendering: `f-flow`, `f-canvas`, nodes, connectors, and connections.
- Interaction helpers for editor UX: drag, zoom, selection area, minimap, alignment lines, and equal spacing guides.
- APIs that fit modern Angular: standalone components, signal-friendly patterns, SSR-aware setups.

## Why / Use cases

Most diagram editors fail not on rendering, but on interaction details: hit-testing, pointer edge cases, snapping, selection UX, and consistent connection behavior.  
Foblex Flow exists for teams that want these building blocks in Angular **without implementing low-level drag logic, hit-testing, and SVG path rendering from scratch**.

Typical use cases:

- Workflow and automation builders (internal tools, operations tooling).
- Low-code/no-code logic editors (rules, conditions, branching).
- Visual programming tools and AI pipeline designers.
- Back-office tools where entities and relations are edited as a graph.

## Interactive examples

Explore live demos built with Foblex Flow:

- [Call Flow Editor](https://github.com/Foblex/f-flow-example)
- [Logic Configuration Tool](https://flow.foblex.com/examples/ai-low-code-platform)
- [Schema Designer](https://flow.foblex.com/examples/schema-designer)
- [Examples overview](./examples/overview)

You can also browse the source code for all demos in `libs/f-examples/**`.

## How it works

You compose a flow from primitives: one `f-flow` root, one `f-canvas`, nodes with connectors, and connection components.

Foblex Flow focuses on **rendering and interaction**. Your application owns the graph model (nodes, connections, metadata) and decides how to update it. The library emits interaction events (drag, selection changes, connection create/reassign) so you can:

- keep business state in your own store (signals, RxJS, NgRx, plain services),
- persist changes to your backend in a predictable way,
- apply domain rules (validation, limits, permissions) where they belong.

## Quick FAQ

- **Is Foblex Flow hard to use?** No. The minimal editor path is small and stays inside normal Angular templates.
- **Do I need caching or virtualization?** No. Most editors start without them. They are optional tools for larger scenes and heavier redraw workloads.
- **Who is it best for?** Angular teams building node editors, workflow builders, interactive diagrams, and graph-based internal tools.

## Next steps

This page is an overview. Use these guides for exact contracts:

- [Flow](f-flow-component)
- [Canvas](f-canvas-component)
- [Node](f-node-directive)
- [Connection](f-connection-component)
- [Drag and Drop](f-draggable-directive)

## Notes / Pitfalls

- Use **stable ids** for nodes and connectors to keep connections predictable (`fNodeId`, `fInputId`, `fOutputId`).
- Style primitives explicitly for production UI - defaults are intentionally minimal.
- Add advanced helpers (selection area, minimap, alignment/spacing) after base rendering is stable.

## Example

::: ng-component <custom-nodes></custom-nodes> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/custom-nodes/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/custom-nodes/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/nodes/custom-nodes/example.scss
:::

## Support Foblex Flow

If this page helped you build something (or saved you from writing drag+drop and SVG connection logic from scratch), please ⭐ the repo on [GitHub](https://github.com/Foblex/f-flow) — it directly helps the project grow.
