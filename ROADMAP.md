# 🛣 Foblex Flow Roadmap

Welcome to the official development roadmap for **Foblex Flow** - an Angular-native library for building customizable visual flow editors, workflow builders, and diagram systems.

This file now tracks two things in one place:

- what is currently queued, in progress, or planned,
- what has already shipped, based on published GitHub releases.

This roadmap is synchronized with the release history through **v18.5.0 (2026-04-14)**.

Stay up to date and help shape the future via [GitHub Discussions](https://github.com/Foblex/f-flow/discussions).

---

## Snapshot

| Status                     | Item                                                 | Notes                                                                                                                                                                  |
| -------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Released in v18.5.0** | **Layout Engines + Reference Apps**                  | Shared layout integration surface with published Dagre and ELK adapters, explicit render lifecycle outputs, and major demos promoted to standalone apps.               |
| 🚧 **In Progress**         | **Freeform Connections**                             | Unified `<f-connector>` replacing the input/output split — a single connector that can send, receive, or do both. [↗](https://github.com/Foblex/f-flow/discussions/88) |
| 🧭 **Planned**             | **Smart Auto-Layout on Resize**                      | When a node expands or collapses, nearby nodes shift to keep the layout clean — no manual cleanup after a resize.                                                      |
| 🧭 **Planned**             | **Path Highlighting**                                | Trace and highlight upstream, downstream, or full connected paths from any node. Class-based — your CSS defines the look.                                              |
| 🧭 **Planned**             | **Flow Execution Animation**                         | Animate execution along the graph — from a predefined sequence or driven by real runtime events. Ideal for AI pipelines and live workflows.                            |
| 🧭 **Planned**             | **Layer Ordering**                                   | Reorder built-in layers (groups, connections, nodes) to match your editor's visual style.                                                                              |
| 🧭 **Planned**             | **Config-driven Architecture (`provideFoblexFlow`)** | Modern Angular provider API — `provideFoblexFlow(withMinimap(), withMagneticLines(), ...)`. Tree-shakeable, centralized, idiomatic.                                    |
| 🧭 **Planned**             | **Grid-Aware Resize Handles**                        | Resize handles snap to gridlines for more precise editing. [↗](https://github.com/Foblex/f-flow/discussions/130)                                                       |

---

## Shipped Timeline

### 2026 Releases

- **[v18.5.0](https://github.com/Foblex/f-flow/releases/tag/v18.5.0)** - **2026-04-14**  
  Shipped the shared layout integration surface, published Dagre and ELK adapters, added explicit `fNodesRendered` / `fFullRendered` lifecycle outputs, promoted major demos into standalone reference apps, and strengthened the portal/docs toolchain.

- **[v18.4.0](https://github.com/Foblex/f-flow/releases/tag/v18.4.0)** - **2026-04-02**  
  Shipped `f-auto-pan`, the default theme entrypoint, smoother trackpad pinch zoom, refreshed example controls, and additional connector-geometry hardening.

- **[v18.3.0](https://github.com/Foblex/f-flow/releases/tag/v18.3.0)** - **2026-03-17**  
  Shipped projected `f-connection-gradient`, smarter redraw caching for unchanged routes and markers, production-safe blob worker loading, and the roadmap/docs refresh around the new connection model.

- **[v18.2.0](https://github.com/Foblex/f-flow/releases/tag/v18.2.0)** - **2026-03-09**  
  Shipped `fCache`, `*fVirtualFor`, the first `f-connection-worker` release, `fNodeRenderLimit`, chunked connection redraws, and wheel zoom during active drag sessions.

- **[v18.1.0](https://github.com/Foblex/f-flow/releases/tag/v18.1.0)** - **2026-02-16**  
  Shipped `f-magnetic-lines`, `f-magnetic-rects`, the AI Low-Code Platform reference app, and a major documentation refresh.

- **[v18.0.0](https://github.com/Foblex/f-flow/releases/tag/v18.0.0)** - **2026-01-26**  
  Shipped connection waypoints, pinch-to-zoom, better Angular control-flow/content-projection support, and richer custom backgrounds.

### 2025 Releases

- **[v17.9.5](https://github.com/Foblex/f-flow/releases/tag/v17.9.5)** - **2025-10-27**  
  Shipped connectable-side strategies, `AdaptiveCurveBuilder`, and broader rendering performance improvements for larger diagrams.

- **[17.8.5](https://github.com/Foblex/f-flow/releases/tag/17.8.5)** - **2025-10-05**  
  Expanded `EFConnectableSide` with manual, calculated, axis-limited, and `AUTO` modes for smarter connection routing.

- **[v17.8.0](https://github.com/Foblex/f-flow/releases/tag/v17.8.0)** - **2025-09-15**  
  Shipped `fConnectionContent`, validation by input id and category, Showcase rollout, and the migration path away from `fConnectionCenter` / `fText`.

- **[v17.7.0](https://github.com/Foblex/f-flow/releases/tag/v17.7.0)** - **2025-08-24**  
  Shipped smarter grouping, `fAutoSizeToFitChildren`, `fAutoExpandOnChildHit`, plus copy/paste and undo/redo reference examples.

- **[v17.6.0](https://github.com/Foblex/f-flow/releases/tag/v17.6.0)** - **2025-07-23**  
  Shipped connection reassignment redesign, minimap refactor, debounced `fCanvasChange`, and `fDragBlocker`.

- **[v17.5.5](https://github.com/Foblex/f-flow/releases/tag/v17.5.5)** - **2025-07-19**  
  Focused on rendering stability, drag handling fixes, and release hardening between larger feature milestones.

- **[v17.5.0](https://github.com/Foblex/f-flow/releases/tag/v17.5.0)** - **2025-05-11**  
  Shipped Angular schematics (`ng add` / `ng update`), rotatable nodes, `fMinimapClass`, minimum-size resize handles, and walkthrough support.

- **[v17.4.0](https://github.com/Foblex/f-flow/releases/tag/v17.4.0)** - **2025-02-10**  
  Shipped custom drag/zoom triggers, grid-based dragging, drag start/end data events, connection validation, and directional resize handles.

- **[v17.2.1](https://github.com/Foblex/f-flow/releases/tag/v17.2.1)** - **2025-02-08**  
  Delivered early grid-dragging work and a broader `fDraggable` refactor that laid groundwork for the later 17.4 interaction improvements.

- **[v17.1.1](https://github.com/Foblex/f-flow/releases/tag/v17.1.1)** - **2025-01-25**  
  Shipped attach-node-to-connection-on-drop, snap-to-guides improvements, grouping data in selection events, and zoom-trigger refinements.

### 2024 Foundations

- **[v17.0.0](https://github.com/Foblex/f-flow/releases/tag/v17.0.0)** - **2024-12-29**  
  Removed the RxJS dependency, improved connection text positioning, and expanded the examples and E2E coverage substantially.

- **[v16.0.0](https://github.com/Foblex/f-flow/releases/tag/v16.0.0)** - **2024-09-24**  
  Shipped SSR support, snap-connection helpers for create/reassign flows, `centerNodeOrGroup`, `getFlowState`, and the modernized canvas API.

- **[12.6.0](https://github.com/Foblex/f-flow/releases/tag/12.6.0)** - **2024-09-10**  
  Shipped `f-group`, Dagre and ELKJS layout examples, the DB management example, and grouping-aware layer sorting improvements.

- **[v12.5.0](https://github.com/Foblex/f-flow/releases/tag/v12.5.0)** - **2024-08-11**  
  Shipped minimap support and zoneless compatibility.

- **[v12.4.0](https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md#1240---2024-08-05)** - **2024-08-05**  
  Shipped multi-layer canvas backgrounds and fit-to-screen related fixes.

- **[V12.2.0](https://github.com/Foblex/f-flow/releases/tag/V12.2.0)** - **2024-04-25**  
  Shipped custom connection types and early resize-handle UX.

---

## Reading Guide

- Use **Snapshot** if you want the current state of work.
- Use **Shipped Timeline** if you want to know exactly what landed and when.
- Use **CHANGELOG.md** before upgrading if you need migration details or breaking changes.

---

## 📊 Feature Voting

Help decide what lands next.

Visit the [Discussions](https://github.com/Foblex/f-flow/discussions) or [Issues](https://github.com/Foblex/f-flow/issues) and react with 👍 to the features you want most.

We build Foblex Flow **with the community**, not around it.

---
