# Foblex Flow Roadmap

This page combines the current roadmap with the shipped release timeline, so you can see both what is next and what has already landed.

It is synchronized with:

- published GitHub releases through **March 9, 2026**,
- the current `CHANGELOG.md` `Unreleased` section for code that is already on `main` but not released yet.

## Description

Use this page when you want to answer one of these questions quickly:

- What is currently being worked on?
- Which release introduced a specific capability?
- How has Foblex Flow evolved across 2024, 2025, and 2026?

For migration details and breaking changes, always check the [Changelog](https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md) before upgrading.

## Current Status

| Status                    | Item                               | Notes                                                                                                                                                          |
| ------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 👀 **Queued for release** | **Projected Connection Gradients** | Already listed in `CHANGELOG.md` `Unreleased`. Gradient colors move to projected `f-connection-gradient`.                                                      |
| 🚧 **In Progress**        | **Freeform Connections**           | Create connections without explicitly defined inputs/outputs. Connect from/to any node edge. [Discussion #88](https://github.com/Foblex/f-flow/discussions/88) |
| 🧭 **Planned**            | **Grid-Aware Resize Handles**      | Resize handles snap to gridlines for more precise editing. [Discussion #130](https://github.com/Foblex/f-flow/discussions/130)                                 |

## Release Timeline

### 2026

- **[v18.2.0](https://github.com/Foblex/f-flow/releases/tag/v18.2.0)** - **2026-03-09**  
  Performance and scale release: `fCache`, `*fVirtualFor`, `f-connection-worker`, `fNodeRenderLimit`, chunked redraws, and zoom during drag.  
  Examples: [Large Scene Performance](https://flow.foblex.com/examples/stress-test), [Connection Redraw Performance](https://flow.foblex.com/examples/stress-test-with-connections)

- **[v18.1.0](https://github.com/Foblex/f-flow/releases/tag/v18.1.0)** - **2026-02-16**  
  Alignment and adoption release: `f-magnetic-lines`, `f-magnetic-rects`, AI Low-Code Platform reference app, and a major docs refresh.  
  Examples: [Magnetic Lines](https://flow.foblex.com/examples/magnetic-lines), [Magnetic Rects](https://flow.foblex.com/examples/magnetic-rects), [AI Low-Code Platform](https://flow.foblex.com/examples/ai-low-code-platform)

- **[v18.0.0](https://github.com/Foblex/f-flow/releases/tag/v18.0.0)** - **2026-01-26**  
  Interaction release: connection waypoints, pinch-to-zoom, Angular control-flow/content-projection improvements, and richer custom backgrounds.  
  Examples: [Connection Waypoints](https://flow.foblex.com/examples/connection-waypoints), [Zoom](https://flow.foblex.com/examples/zoom), [Background](https://flow.foblex.com/examples/background)

### 2025

- **[v17.9.5](https://github.com/Foblex/f-flow/releases/tag/v17.9.5)** - **2025-10-27**  
  Added connectable-side strategies, `AdaptiveCurveBuilder`, and additional rendering performance work.

- **[17.8.5](https://github.com/Foblex/f-flow/releases/tag/17.8.5)** - **2025-10-05**  
  Expanded `EFConnectableSide` with manual, calculated, axis-limited, and `AUTO` modes for smarter routing.

- **[v17.8.0](https://github.com/Foblex/f-flow/releases/tag/v17.8.0)** - **2025-09-15**  
  Added `fConnectionContent`, validation by input id and category, and the migration path away from deprecated connection text APIs.  
  Examples: [Connection Content](https://flow.foblex.com/examples/connection-content), [Connection Rules](https://flow.foblex.com/examples/connection-rules)

- **[v17.7.0](https://github.com/Foblex/f-flow/releases/tag/v17.7.0)** - **2025-08-24**  
  Added smarter grouping, `fAutoSizeToFitChildren`, `fAutoExpandOnChildHit`, plus copy/paste and undo/redo reference patterns.  
  Examples: [Grouping](https://flow.foblex.com/examples/grouping), [Drag to Group](https://flow.foblex.com/examples/drag-to-group), [Copy/Paste](https://flow.foblex.com/examples/copy-paste), [Undo/Redo V2](https://flow.foblex.com/examples/undo-redo-v2)

- **[v17.6.0](https://github.com/Foblex/f-flow/releases/tag/v17.6.0)** - **2025-07-23**  
  Reworked connection reassignment, refreshed the minimap, added debounced `fCanvasChange`, and introduced `fDragBlocker`.

- **[v17.5.5](https://github.com/Foblex/f-flow/releases/tag/v17.5.5)** - **2025-07-19**  
  Stabilization release focused on rendering, drag handling, and example hardening.

- **[v17.5.0](https://github.com/Foblex/f-flow/releases/tag/v17.5.0)** - **2025-05-11**  
  Added Angular schematics (`ng add` / `ng update`), rotatable nodes, `fMinimapClass`, walkthrough support, and stronger resize handles.  
  Example: [Rotate Handle](https://flow.foblex.com/examples/rotate-handle)

- **[v17.4.0](https://github.com/Foblex/f-flow/releases/tag/v17.4.0)** - **2025-02-10**  
  Added custom drag/zoom triggers, grid-based dragging, drag start/end data events, connection validation, and directional resize handles.  
  Examples: [Custom Event Triggers](https://flow.foblex.com/examples/custom-event-triggers), [Grid System](https://flow.foblex.com/examples/grid-system), [Drag Start / End Events](https://flow.foblex.com/examples/drag-start-end-events), [Resize Handle](https://flow.foblex.com/examples/resize-handle)

- **[v17.2.1](https://github.com/Foblex/f-flow/releases/tag/v17.2.1)** - **2025-02-08**  
  Early grid-dragging work plus a broader `fDraggable` refactor that prepared the later interaction stack updates.

- **[v17.1.1](https://github.com/Foblex/f-flow/releases/tag/v17.1.1)** - **2025-01-25**  
  Added attach-node-to-connection-on-drop, selection event improvements, line-alignment work, and zoom-trigger refinements.

### 2024 Foundations

- **[v17.0.0](https://github.com/Foblex/f-flow/releases/tag/v17.0.0)** - **2024-12-29**  
  Removed the RxJS dependency, improved connection-text positioning, and expanded examples plus E2E coverage significantly.

- **[v16.0.0](https://github.com/Foblex/f-flow/releases/tag/v16.0.0)** - **2024-09-24**  
  Added SSR support, snap-connection helpers for create/reassign flows, `centerNodeOrGroup`, `getFlowState`, and a cleaner canvas API.

- **[12.6.0](https://github.com/Foblex/f-flow/releases/tag/12.6.0)** - **2024-09-10**  
  Added `f-group`, Dagre and ELKJS examples, the DB management reference example, and grouping-aware layer sorting.

- **[v12.5.0](https://github.com/Foblex/f-flow/releases/tag/v12.5.0)** - **2024-08-11**  
  Added minimap support and zoneless compatibility.

- **[v12.4.0](https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md#1240---2024-08-05)** - **2024-08-05**  
  Added multi-layer canvas backgrounds and fixed fit-to-screen-related issues.

- **[V12.2.0](https://github.com/Foblex/f-flow/releases/tag/V12.2.0)** - **2024-04-25**  
  Added custom connection types and early resize-handle support.

## Capability Map

- **Performance and scale**: `v18.2.0`, `v17.9.5`, `v12.5.0`
- **Connection authoring and routing**: `v18.0.0`, `17.8.5`, `v17.8.0`, `v16.0.0`, `V12.2.0`
- **Editor UX and interactions**: `v18.1.0`, `v17.7.0`, `v17.6.0`, `v17.5.0`, `v17.4.0`, `v17.1.1`
- **Platform and integration**: `v16.0.0`, `v17.5.0`, `v18.1.0`

## Related Links

- [GitHub Releases](https://github.com/Foblex/f-flow/releases)
- [Changelog](https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md)
- [Examples Overview](https://flow.foblex.com/examples/overview)
- [Articles Overview](https://flow.foblex.com/blog/overview)
- [GitHub Discussions](https://github.com/Foblex/f-flow/discussions)

## Notes

- This page is release-oriented, not branch-oriented.
- If a feature appears in `CHANGELOG.md` `Unreleased`, it means the work exists on `main` but has not been published yet.
- If you are planning an upgrade, prefer the changelog for migration guidance and this page for historical context.
