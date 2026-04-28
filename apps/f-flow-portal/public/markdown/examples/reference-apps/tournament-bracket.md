---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-04-13"
---

# Tournament Bracket

## Example

This example demonstrates how to model a tournament bracket with Foblex Flow. It takes the same node-and-connection primitives used in workflow tools and applies them to a competition tree with domain-specific layout, filtering, and detail views.

::: ng-component <tournament-bracket></tournament-bracket> [height]="600"
:::

## User-Facing Capabilities

- Browse a full elimination bracket on a pannable and zoomable canvas.
- Switch between standard, compact, and mirrored bracket layouts.
- Toggle upper, lower, and final branches independently.
- See live counters for played, live, and upcoming matches.
- Select a match to highlight the path around it.
- Select a team to highlight its journey through visible rounds.
- Open detail panels for match timing, status, score, and team statistics.
- Use minimap, fit-to-screen, reset zoom, and theme toggle controls.

## Foblex Flow Features Used

- `f-flow` and `f-canvas` as the canvas root.
- `fZoom` for interactive viewport scale.
- `fNode` for match cards.
- `fConnection` with fixed segmented routing for bracket links.
- `fConnectionMarkerArrow` for directional relation markers.
- `fMinimap` for overview navigation.
- `provideFLayout(...)` to plug a custom tournament layout engine into the Flow rendering pipeline.

## Why It Matters

It is a strong reference when you want to prove that Foblex Flow is not limited to process editors. The example shows how to keep your own domain model and your own layout rules while still reusing the same interaction primitives for panning, zooming, selection, minimap, and connected rendering.

## Links

- Source code: [apps/example-apps/tournament-bracket](https://github.com/Foblex/f-flow/tree/main/apps/example-apps/tournament-bracket)
