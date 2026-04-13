---
toc: false
wideContent: true
---

# Auto Snap

## Description

This guide explains how to automatically snap connections when they are dropped near a connector, offering a comprehensive solution for building interactive flow-based diagrams. To implement this functionality, you need to add the `<f-snap-connection>` component inside the `<f-canvas>`. This component handles temporary connection display and snapping to the nearest connector when the threshold is reached.

Auto snap reduces friction during edge creation, especially in dense editors where users expect the nearest valid connector to “catch” the pointer before a perfect drop.
It is a small feature, but it often makes the editor feel significantly more polished.
It also reduces failed connection attempts and makes touchpad or high-zoom interactions less frustrating for end users.
That makes it especially useful in production editors where connection creation is a frequent action.

## Example

::: ng-component <auto-snap></auto-snap> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/auto-snap/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/auto-snap/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/auto-snap/example.scss
:::

## Related docs

- [Snap Connection Docs](./docs/f-snap-connection-component)
- [Drag to Connect Example](./examples/drag-to-connect)
