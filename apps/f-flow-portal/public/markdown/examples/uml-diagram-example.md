---
toc: false
wideContent: true
---

# UML Architecture Diagram

## Example

This page demonstrates how to build a custom diagram editor with `@foblex/flow` and Angular.
The sample data is UML-styled, but the focus is the library integration patterns.

::: ng-component <uml-diagram-example></uml-diagram-example> [height]="1080"
:::

## Library Building Blocks Used

- `f-flow` as the interaction root.
- `f-canvas` with `fZoom` for viewport and scale control.
- `fNode` and `fGroup` for rendering movable graph elements.
- `fConnection` with explicit routing sides, connection behavior, and line types.
- Custom SVG markers via `fMarker` for relation semantics.
- `f-background` and `f-line-alignment` for canvas readability.
- Programmatic viewport controls: fit to screen and reset center.
- Standalone Angular composition with local state for nodes, groups, and connections.

## Why This Matters For The Library

`@foblex/flow` is domain-agnostic. This example shows how library primitives can be composed into a structured, production-style diagram surface with custom rendering and routing logic.
You can replace UML data with any domain model and keep the same flow architecture.

## Source Code

The full project source for this example is in:

- [`libs/f-pro-examples/uml-diagram-example`](https://github.com/Foblex/f-flow/tree/main/libs/f-pro-examples/uml-diagram-example)
