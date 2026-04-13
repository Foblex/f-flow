---
toc: false
wideContent: true
---

# Connection Markers

## Description

This example now shows the three main ways to work with [connection markers](./docs/f-connection-marker-directive).

- Use built-in shape markers when you want a quick default setup: `<f-connection-marker-circle />` and `<f-connection-marker-arrow />`.
- Use custom `svg[fMarker]` when you need product-specific geometry, sizing, or branding.
- Use `EFMarkerType.START_ALL_STATES` and `EFMarkerType.END_ALL_STATES` when the same marker should be rendered for both normal and selected connections.

Markers are useful when the meaning of an edge matters: direction, approval, success or failure paths, or domain-specific relationship types. They let you add meaning to a connection without changing routing or building a custom connection renderer.

In this demo:

- The first connection uses the built-in `circle` and `arrow` markers.
- The second connection uses custom SVG markers that apply to both normal and selected states.
- The third connection shows the fully explicit mode, where normal and selected markers are defined separately.

## Example

::: ng-component <connection-markers></connection-markers> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/connection-markers/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/connection-markers/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/connection-markers/example.scss
:::

## Related docs

- [Connection Marker Docs](./docs/f-connection-marker-directive)
- [Connection Content Example](./examples/connection-content)
