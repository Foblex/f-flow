# Schema Designer

Interactive schema-modeling reference app built with Angular and Foblex Flow.

## User-Facing Functionality

- Drag tables around the canvas and keep relations attached.
- Create new relations from column outputs and drop them onto compatible inputs.
- Reassign an existing relation to another target column.
- Open a context menu on the canvas, table, column, or relation.
- Create tables and columns directly from the editor.
- Change column key type between primary, unique, index, or none.
- Edit column names and column data types inline.
- Change relation cardinality from the floating relation toolbar.
- Delete the current column, table, or relation.
- Use selection area, minimap, zoom, fit-to-screen, and reset view controls.

## Foblex Flow Building Blocks Used

- `f-flow` as the editor root and drag surface.
- `f-canvas` with `fZoom` for viewport scale and pan handling.
- `fNode` for table containers.
- `fNodeInput` and `fNodeOutput` for column-level connectors.
- `fConnection` for rendered relations.
- `fConnectionForCreate` for drag-to-connect creation.
- `fSnapConnection` for snap-assisted reassignment behavior.
- `fSelectionChange`, `fCreateConnection`, and `fReassignConnection` events for editor state updates.
- `fBackground`, `fCirclePattern`, `fMagneticLines`, `fSelectionArea`, and `fMinimap` for canvas tooling.
- `fConnectionContent` for the inline relation toolbar.

## Integration Notes

- The example combines Foblex Flow primitives with Angular Material inputs, selects, icons, and context-menu UI.
- Selection, CRUD actions, and relation updates are managed through local signal-based state in `EditorStore`.
- Context menu behavior is target-aware, so the same popup can act on canvas, table, column, or relation.

## Run Locally

From this directory:

```bash
npm run dev
npm run build
npm run lint
```

Or from the workspace root:

```bash
npx nx serve schema-designer --configuration development
```

## Source

- Portal page: `https://flow.foblex.com/examples/schema-designer`
- App folder: `apps/example-apps/schema-designer`
