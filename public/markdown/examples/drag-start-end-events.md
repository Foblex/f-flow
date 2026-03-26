---
toc: false
wideContent: true
summary: "Track drag start and end events for nodes and edges in Angular graph editors."
primaryKeyword: "angular drag start end events example"
schemaType: "TechArticle"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Drag Start/End Events

## Description

This example demonstrates how to listen to `fDragStarted` and `fDragEnded` so you can react to user movement in real time. These events are useful when the editor needs to show helper UI, update external state, log analytics, or coordinate drag behavior with other parts of the application.

Drag lifecycle events become especially valuable in production editors where the graph is only one part of the interface. A sidebar, inspector, minimap, or validation layer may all need to react when dragging starts or ends.

Used well, these hooks help you build cleaner state transitions instead of burying UI logic inside generic pointer handlers.

## Example

::: ng-component <drag-start-end-events></drag-start-end-events> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component.scss
:::

## What this solves

- Show or hide helper UI during drag interactions.
- Trigger analytics or custom business logic around drag lifecycle.
- Coordinate graph movement with external Angular state.

This is a practical example for teams building richer editing workflows rather than static diagram demos.

## Related docs

- [Event System](./docs/event-system)
- [Draggable Directive](./docs/f-draggable-directive)
- [Node Selection Example](./examples/node-selection)
- [Selection Area Example](./examples/selection-area)
