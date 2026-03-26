---
toc: false
wideContent: true
---

# Connection Markers

## Description

This guide shows how to set up different [connection markers](./docs/f-connection-marker-directive), allowing various markers to be displayed on connections between connectors. To enable this feature, add an SVG element with the [f-connection-marker directive](./docs/f-connection-marker-directive) inside the [f-connection component](./docs/f-connection-component).

Markers are useful when the meaning of an edge matters: direction, approval, success/failure paths, or domain-specific relationship types. They help users read the graph faster without opening a separate legend.

They are also a straightforward way to make graph semantics visible without changing node layout or connection routing.
That is valuable when a diagram should stay readable at a glance.
For product teams, markers are often the fastest way to add visual meaning to a connection without building a custom edge renderer from scratch.

## Example

::: ng-component <connection-markers></connection-markers> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-markers/connection-markers.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-markers/connection-markers.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-markers/connection-markers.scss
:::

## Related docs

- [Connection Marker Docs](./docs/f-connection-marker-directive)
- [Connection Content Example](./examples/connection-content)
