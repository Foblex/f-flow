---
publishedAt: "2026-04-02"
updatedAt: "2026-04-02"
---

# Foblex Flow v18.4.0: Auto-Pan, Default Theme, and Smoother Trackpad Zoom

Foblex Flow v18.4.0 is focused on the parts of editor UX that people feel immediately: how the viewport behaves while dragging, how fast a new flow gets styled, and how natural zoom feels on modern laptops.

Today I’m shipping **v18.4.0**. This release adds the new **`f-auto-pan` plugin**, ships a ready-to-use **default SCSS theme**, smooths **trackpad pinch-to-zoom**, and cleans up the example portal so examples feel more consistent in both code and presentation.

## Highlights

- 🧭 **`f-auto-pan`** adds edge-based viewport panning during supported drag sessions.
- 🎨 **A shipped default theme** makes it much easier to get a styled editor without rebuilding the whole visual layer from scratch.
- 🎛️ **Example controls were refreshed** with reusable toolbar, input, select, and overlay primitives.
- 🤏 **Trackpad pinch-to-zoom feels smoother** by separating gesture-wheel normalization from regular mouse-wheel stepping.
- 📚 **Docs and release pages were tightened up** around the new theme, auto-pan, and current release history.

## Auto-Pan Is Now a First-Class Flow Plugin

The biggest interaction feature in v18.4.0 is `f-auto-pan`.

Instead of pushing this behavior into `fDraggable` inputs, the release makes it an explicit plugin inside `f-flow`, which fits the rest of the library better and keeps the public API clearer.

```html
<f-flow fDraggable>
  <f-auto-pan
    [fEdgeThreshold]="40"
    [fSpeed]="8"
    [fAcceleration]="true"
  />

  <f-selection-area />

  <f-canvas fZoom>
    <!-- nodes and connections -->
  </f-canvas>
</f-flow>
```

In this first version, auto-pan supports the drag flows that benefit from it most:

- connection creation
- connection reassignment
- node dragging
- selection area extension

That makes a big difference in real editors where targets are slightly outside the viewport and users should not have to stop, pan manually, and restart the same interaction.

::: ng-component <auto-pan></auto-pan> [height]="700"
:::

## The Default Theme Is Now Shipped

v18.4.0 also formalizes the styling path that many teams want first: a ready-to-use theme that gives you a coherent editor immediately, while still leaving room for more selective mixin-based styling later.

```scss
@use '@foblex/flow/styles/default';
```

The shipped theme is built on top of the same public styling surface documented in the new styling guides:

- exported SCSS mixins
- public `--ff-*` alias tokens
- domain-level theme layers for canvas, nodes, connectors, connections, plugins, and external items

This release also aligns `ng add` and docs around that path, so the “quick start” styling story is much more consistent than before.

## Example Portal Controls Are Cleaner

The examples portal also got a practical cleanup in this release.

Instead of repeating ad-hoc control markup or leaning on heavier Material form-field patterns in small demos, examples now use shared portal UI primitives for toolbar layout and native input/select controls where that makes more sense.

That improves a few things at once:

- examples read more consistently
- example code is easier to copy into real projects
- the demo UI stays visually aligned with the rest of the portal

This is not a headline API feature in the same way as `f-auto-pan`, but it improves the day-to-day experience of learning the library.

## Trackpad Zoom Feels Less “Steppy”

Touch-device pinch-to-zoom was already supported through the pointer/touch flow.

The awkward case in practice was **trackpad pinch**, because many laptops report it as wheel-like gesture events rather than the same multi-touch pointer sequence used on touch screens. Treating those events like a normal mouse wheel made zoom feel too discrete and jumpy.

In v18.4.0, wheel-based gesture zoom now follows trackpad deltas more closely and avoids forcing them through the same minimum-step floor as a classic wheel mouse.

That makes viewport zoom feel noticeably more natural on MacBooks and other precision-touchpad setups.

## Connector Geometry and Docs Polish

This release also keeps the geometry work moving in the right direction.

Rounded connector calculations were hardened again so floating intersections behave more predictably across redraw, create, reassign, drag, and resize flows, especially when connector geometry becomes more complex.

On the docs side, the release rounds out:

- auto-pan guides and example docs
- default-theme and styling guides
- release history consistency across changelog, roadmap, and blog overview

## Release Links

- Release: <https://github.com/Foblex/f-flow/releases/tag/v18.4.0>
- Changelog: <https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md>
- Auto Pan example: <https://flow.foblex.com/examples/auto-pan>
- Zoom example: <https://flow.foblex.com/examples/zoom>
- Styling docs: <https://flow.foblex.com/docs/default-theme-and-styling>

## Closing

v18.4.0 is an editor-quality release.

It does not revolve around one huge new subsystem. Instead, it improves the things people touch constantly: dragging near viewport edges, getting a good-looking editor running quickly, and zooming naturally on trackpads.

Those are the kinds of changes that make Foblex Flow feel more production-ready in everyday use.
