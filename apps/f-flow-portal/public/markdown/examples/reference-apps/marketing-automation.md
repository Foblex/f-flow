---
toc: false
wideContent: true
publishedAt: "2026-07-17"
---

# Marketing Automation

## Example

This product-style example builds a marketing journey without dragging workflow steps around the canvas. Users pan and zoom the workspace, then insert a typed step from a searchable picker on an existing connection or at the end of an open branch. Dagre recalculates the complete journey after every structural change.

::: ng-component <marketing-automation></marketing-automation> [height]="650"
:::

## User-Facing Capabilities

- Add email, SMS, webhook, wait, audience, condition, goal, and exit steps from a searchable picker.
- Insert a step directly between two connected steps without manually reconnecting the journey.
- Continue every open output, including both branches created by a condition.
- Select a trailing add control with keyboard navigation and press `Enter` to open its step picker.
- Switch the automatic layout between top-to-bottom and left-to-right directions.
- Edit the selected step in an inspector and pause or reactivate it.
- Undo and redo structural edits as complete operations, including the resulting layout, as well as settled viewport changes.
- Persist the journey, viewport transform, layout direction, and theme locally.
- Navigate the canvas with the default control scheme, keyboard accessibility, zoom tools, and minimap.

## One Add Control, Two Rendering Roles

The saved campaign model contains only real steps and real connections. Open outputs are derived from that model during layout; they are never stored as domain nodes.

The same `CampaignAddButton` component is rendered in two places:

- As `fConnectionContent` at the midpoint of a real connection, where it inserts a step between the source and target.
- As a small, derived `fNode` at an open output, where it provides geometry for Dagre and a target for the dashed preview connection.

This keeps the interaction and picker implementation unified without polluting exported or persisted campaign data with editor-only placeholders.

## Layout and State Transaction

The example uses the Dagre plugin in manual mode with `EDagreLayoutAlgorithm.LONGEST_PATH`, spacious node and layer gaps, and a selectable direction. A structural command starts `FFlowState.beginBatch()`, updates the domain graph, awaits the asynchronous layout, applies calculated positions with `amendCurrent()`, and then calls `endBatch()`. The graph mutation and every resulting node move therefore become one undo item.

Selection and viewport transforms use the State plugin's default history behavior. When one node is selected, the example keeps a State batch open through the animated `resetScaleAndCenterGroupOrNode()` update. This centers the node at zoom `1` and captures the resulting canvas transform before closing the batch. Selection and centering are therefore one undo item and one persistence update. Both are persisted with the snapshot, so the selected campaign step and the settled viewport are restored after a reload. Layout direction is treated as a view preference and is persisted without creating an undo item.

## Foblex Flow Features Used

- `f-flow` and `f-canvas` as the pannable workflow surface.
- `fNode` with dragging disabled for layout-owned campaign steps.
- Unified `fConnector` inputs for direction-aware campaign outputs.
- `fConnectionContent` for actionable content on existing connections.
- `provideFLayout(...)` with the Dagre layout plugin in manual mode.
- `withFlowState()` for typed records, batching, undo/redo, and persistence hooks.
- `withA11y()` and the default control scheme for built-in keyboard and pointer behavior.
- `fZoom`, `fBackground`, connection markers, and `fMinimap` for viewport usability.

## Links

- Source code: [apps/example-apps/marketing-automation](https://github.com/Foblex/f-flow/tree/main/apps/example-apps/marketing-automation)
