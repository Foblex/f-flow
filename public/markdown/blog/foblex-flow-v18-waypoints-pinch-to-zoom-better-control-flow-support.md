---
origin: "https://medium.com/@shuzarevich/foblex-flow-v18-waypoints-pinch-to-zoom-and-better-control-flow-support-8d290f946916"
originLabel: "Originally published on Medium"
title: "Foblex Flow v18: Waypoints, Pinch-to-Zoom, and Better Control Flow Support"
description: "Foblex Flow is an Angular library for building node-based editors: flows, diagrams, visual builders — all with a focus on interactive UX and clean APIs."
ogType: "article"
twitterCard: "summary_large_image"
---

Foblex Flow is an Angular library for building node-based editors: flows, diagrams, visual builders — all with a focus on interactive UX and clean APIs.

Today I’m shipping **v18.0.0**, and it’s a big one. The headline features are **Connection Waypoints** and **Pinch-to-Zoom**, plus a few important improvements for real-world Angular apps.

### Connection Waypoints — editable paths for any connection type

Until now, a connection path was mostly a **builder decision** (straight / segment / bezier / adaptive curve).

In v18 you can **edit the connection route** by adding and moving **waypoints**

What it feels like in the editor

- **Drag a candidate point** to create a new waypoint (drag-to-add).
- **Drag an existing waypoint** to adjust the route (drag-to-move).
- **Right click** a waypoint to remove it (simple and fast, no extra selection state).

Waypoints are not a separate connection type — they work **on top of your chosen type**:

straight / segment / bezier / adaptive curve.

✅ Example: <https://flow.foblex.com/examples/connection-waypoints>

::: ng-component <connection-waypoints></connection-waypoints> [height]="600"
:::

Connection Waypoints Example

#### Minimal usage

```html
<f-connection fType="adaptive-curve" fOutputId="1" fInputId="2">
  <f-connection-waypoints [(waypoints)]="waypoints" />
</f-connection>
```

This keeps the **data lives in your app**”principle: Waypoints are just points, and you fully own them.

### Pinch-to-Zoom — finally a first-class multi-touch zoom UX

Zooming used to be wheel/double-click/buttons — good for mouse users, but not enough for modern devices.

v18 adds **pinch-to-zoom**:

- Trackpads (macOS / Windows precision touchpads)
- Touch devices

✅ Example: <https://flow.foblex.com/examples/zoom>

Enable it the same way as normal zoom:

```html
<f-canvas fZoom></f-canvas>
```

### Better compatibility with Angular Control Flow + Content Projection

Angular’s @if / @for are great — but real component trees + content projection can be tricky.

In v18 I updated the canvas projection slots, so you can wrap nodes/connections using grouped slots:

```html
<f-canvas>
  <ng-container ngProjectAs="[fNodes]">
    @for (...) { ... }
  </ng-container>

  <ng-container ngProjectAs="[fConnections]">
    @if (...) { ... }
  </ng-container>
</f-canvas>
```

This makes “conditional rendering + content projection” much more predictable.

### Custom Backgrounds — richer SVG patterns + new example

Backgrounds in flow editors matter more than people think: grid, dots, paper-like patterns, or fully custom SVG.

In v18:

- better support for **complex SVG patterns**
- plus a **new example** showing how to build advanced backgrounds

::: ng-component <background-example></background-example> [height]="600"
:::

### Release + demo

- Release: <https://github.com/Foblex/f-flow/releases/tag/v18.0.0>
- Waypoints example: <https://flow.foblex.com/examples/connection-waypoints>
- Zoom example: <https://flow.foblex.com/examples/zoom>

### Closing

Waypoints are one of those features that instantly level up any node editor:

users can make routes clean, readable, and intentional — without fighting the layout.

If you’re building a visual editor in Angular and want a native Angular solution (not a React wrapper) — take a look.

And if you like what I’m building, please consider starring the repo ⭐️

It helps the project a lot.
