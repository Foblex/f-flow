---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-07-07"
---

# Undo/Redo v2 — Managed State

## Description

This example shows the managed graph state built into Foblex Flow: `provideFFlow(withFlowState())`. The component loads plain data once, renders `state.nodes()` / `state.connections()` with `@for`, and that is the entire integration — there is not a single gesture handler in the code.

Finished gestures are applied to the state automatically, each as one undoable step:

- creating a connection by drag adds a connection record;
- reassigning a connection updates its endpoint;
- moving nodes (including multi-selection) updates their positions as a single step;
- deleting the selection removes the nodes together with their attached connections;
- dropping an external item adds a node with the item's payload as `data`.

`undo()` / `redo()` with the `canUndo` / `canRedo` signals come built in, and `state.snapshot()` returns the whole graph as plain arrays whenever you need to persist it.

## Example

::: ng-component <undo-redo-v2></undo-redo-v2> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/undo-redo-v2/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/undo-redo-v2/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/undo-redo-v2/example.scss
:::

## Practical tips

- `injectFlowState<TNodeData, TConnectionData>()` gives you a typed store; put your own payload into each record's `data` field.
- Reject or reshape gesture results with the `connectionFactory` / `nodeFactory` options of `withFlowState()` — return `null` to veto a connection or a drop.
- Every store behavior is overridable: subclass `FFlowState`, override any CRUD method or any `apply*` gesture handler, and install it via `withFlowState({ stateClass: MyFlowState })` — the auto-wiring dispatches through your class.
- Programmatic edits go through the same store (`addNodes`, `updateNode`, `removeNodes`, …) and share the same history; `moveNodes()` applies many positions as one step.
- `load()` replaces the graph and resets the history — ideal for opening a document; `snapshot()` is its mirror for saving.
- Prefer full control over your own store? The classic event-driven approach is still fully supported — see [Undo/Redo](./examples/undo-redo) for the manual version.

## Related examples

- [Undo/Redo](./examples/undo-redo)
- [AI Low-Code Platform Example](./examples/ai-low-code-platform)
