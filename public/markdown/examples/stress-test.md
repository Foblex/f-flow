---
toc: false
wideContent: true
---

# Large Scene Performance

## Description

This example focuses on large-scene performance in Foblex Flow.
It lets you compare several rendering strategies, including `fCache` and `*fVirtualFor`, while keeping the canvas fully interactive.

What you can test in this demo:

- Large node counts: 200, 500, 1000, 2000, and 5000 nodes.
- Cache toggle: enables `fCache` on `f-flow` to reduce repeated geometry work during redraws.
- Virtualization toggle: uses `*fVirtualFor` to progressively render projected nodes and compare startup/render cost against the regular `@for` flow.
- Connections toggle: adds a chained connection layer between nodes so you can compare node-only and node-plus-connection workloads.
- Real interactions under load: drag, zoom, selection area, and fit-to-screen remain enabled.

Why this example is useful:

- Measure how your editor behaves when the scene size grows quickly.
- Compare the visual and runtime impact of cache and virtualization independently.
- Check whether your layout and interaction choices still feel responsive once optional connections are enabled.

## Example

::: ng-component <stress-test></stress-test> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/stress-test/stress-test.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/stress-test/stress-test.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/stress-test/stress-test.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
