---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-04-13"
---

# UML Architecture Diagram

## Example

This example shows how to turn Foblex Flow into a richer UML and architecture diagram surface. It combines grouped packages, custom connection markers, semantic relation styling, search, filtering, and side-panel inspection without introducing a separate graph framework.

::: ng-component <uml-diagram-example></uml-diagram-example> [height]="600"
:::

## User-Facing Capabilities

- Explore a multi-package UML-style architecture map on a large canvas.
- Drag package groups and contained classes while preserving their relations.
- Filter the view by architectural layer.
- Filter the view by relation kind.
- Search across class names, stereotypes, attributes, and methods.
- Select a class to inspect its members and connected relations.
- Select a relation to inspect endpoints, multiplicity, and labels.
- Use minimap, zoom, fit-to-screen, reset zoom, theme toggle, and alignment helpers.

## Foblex Flow Features Used

- `f-flow` and `f-canvas` as the diagram root.
- `fZoom` for viewport interaction.
- `fNode` for UML class cards.
- `fGroup` for package containers.
- `fDragHandle` for movable classes and groups.
- `fAutoSizeToFitChildren`, `fAutoExpandOnChildHit`, and `fIncludePadding` for package-group behavior.
- `fConnection` for UML relations with explicit source and target ids.
- `fMarker` for custom SVG markers that encode relation semantics.
- `fBackground`, `fCirclePattern`, `fLineAlignment`, and `fMinimap` for canvas readability and navigation.

## Why It Matters

This is a good reference if you need more than plain boxes and arrows. The example demonstrates that the same Foblex Flow primitives used for node editors can also power architecture maps, dependency diagrams, or domain-specific modeling tools with their own semantics and visual language.

## Links

- Source code: [apps/example-apps/uml-diagram](https://github.com/Foblex/f-flow/tree/main/apps/example-apps/uml-diagram)
