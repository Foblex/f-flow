---
toc: false
wideContent: true
publishedAt: "2026-04-13"
updatedAt: "2026-07-13"
---

# Call Center Flow

## Example

This example shows how to build a product-style call-routing editor on top of Foblex Flow. It combines a left-side node palette, draggable workflow steps, editable node forms, connection creation and reassignment, and viewport tools into a focused IVR and contact-center flow builder.

::: ng-component <call-center></call-center> [height]="600"
:::

## User-Facing Capabilities

- Start from an incoming-call entry point and route calls through schedule, prompt, IVR, queue, operator, transfer, voicemail, and disconnect steps.
- Drag existing nodes around the canvas and keep their links attached.
- Create new steps from the palette by dropping them directly onto the editor surface.
- Create new connections between node outputs and inputs.
- Reassign an existing connection to another target input.
- Expand nodes to edit schedule windows, prompts, IVR branch count, queue settings, operator attributes, transfer number, and voicemail greeting.
- Remove selected nodes or connections, select all, zoom, fit to screen, reset the view, and toggle light or dark theme.
- Keep both the flow state and the canvas transform persisted locally.

## Foblex Flow Features Used

- `f-flow` and `f-canvas` as the workflow surface.
- `fZoom` for viewport scaling and pan.
- `fExternalItem` and `fCreateNode` for palette-driven node creation.
- `fNode` and the unified `fConnector` API for call-flow steps and connectors.
- `fConnection` with segmented routing and `fConnectionMarkerArrow` for directional links.
- `fConnectionForCreate` for drag-to-connect interaction.
- `withFlowState()` for typed records, automatic gesture updates, undo/redo, and local persistence.
- `withReflowOnResize()` for moving downstream steps when an embedded node form expands or collapses.
- `withA11y()` and the default control scheme for keyboard and pointer interaction.
- `fBackground`, `fCirclePattern`, `fLineAlignment`, `fSelectionArea`, and `fMinimap` for canvas usability.

## Application architecture

`CallCenterFlowState` owns editor history and domain commands, `CallCenterFlowStorage` owns local persistence and legacy snapshot normalization, and domain factories construct valid node records and the default call flow. UI components depend on those responsibilities instead of duplicating state, persistence, or record-construction logic.

## Expand, reflow, and undo as one action

An expand/collapse click updates the node record synchronously, while reflow positions arrive later after Angular rendering and `ResizeObserver`. The example opens `FFlowState.beginBatch()` before storing `isExpanded` and closes it after the resize-driven render turn. Reflow's `fMoveNodes` event is therefore committed into the same history item, so one undo restores both the node's content state and every shifted node position.

The toggle also carries `fDragBlocker` because it is rendered inside the node's `fDragHandle`. This keeps the button click from producing a separate selection history item before the expand/reflow transaction.

See the complete [async reflow transaction recipe](./examples/state), including why synchronous `batch()` is insufficient and when two animation frames should be replaced by a real completion signal.

## Why It Matters

This is the most workflow-builder-oriented reference app in the repo. It shows how Foblex Flow fits business-process editors where the canvas is only one part of the product and each node can expose richer form-driven configuration instead of being a static diagram box.

## Links

- Source code: [apps/example-apps/call-center](https://github.com/Foblex/f-flow/tree/main/apps/example-apps/call-center)
