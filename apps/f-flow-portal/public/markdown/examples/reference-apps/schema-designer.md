---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-04-13"
---

# Schema Designer

## Example

This example shows how to build a schema editor on top of Foblex Flow. It combines draggable table nodes, inline column editing, connection creation and reassignment, context-menu actions, and viewport tooling into a canvas that feels closer to a real admin product than a minimal graph demo.

::: ng-component <schema-designer></schema-designer> [height]="600"
:::

## User-Facing Capabilities

- Drag tables around the canvas and keep existing relations attached.
- Create a relation by dragging from one column to another.
- Reassign an existing relation to a different target column.
- Edit column names and column data types inline.
- Open a context menu on the canvas, a table, a column, or a relation.
- Create new tables and columns directly from the editor.
- Change a column key to primary, unique, index, or none.
- Change relation cardinality from the inline relation toolbar.
- Delete the currently targeted column, table, or relation.
- Use selection area, minimap, zoom, reset, fit-to-screen, and theme toggle controls.

## Foblex Flow Features Used

- `f-flow` and `f-canvas` as the root editing surface.
- `fZoom` for canvas-scale control.
- `fNode` for draggable table nodes.
- `fNodeInput` and `fNodeOutput` for column-level connectors.
- `fConnection` for rendered schema relations.
- `fConnectionForCreate` for drag-to-connect creation.
- `fSnapConnection` for snap-assisted relation reassignment.
- `fCreateConnection`, `fReassignConnection`, and `fSelectionChange` events for synchronizing editor state.
- `fConnectionContent` for the floating relation toolbar.
- `fBackground`, `fCirclePattern`, `fMagneticLines`, `fSelectionArea`, and `fMinimap` for editor ergonomics.

## Why It Matters

This is the strongest reference app in the repo when you need to embed Foblex Flow into a broader CRUD-oriented Angular screen. It demonstrates how the canvas can live alongside forms, menus, detail actions, and editor-like state instead of being treated as an isolated widget.

## Links

- Source code: [apps/example-apps/schema-designer](https://github.com/Foblex/f-flow/tree/main/apps/example-apps/schema-designer)
