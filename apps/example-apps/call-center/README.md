# Call Center Flow

Call-center IVR and routing-builder reference app built with Angular and Foblex Flow.

## User-Facing Functionality

- Design incoming-call workflows with schedule checks, prompts, IVR branches, queueing, operator handoff, transfer, voicemail, and disconnect steps.
- Drag nodes around the canvas and keep existing links attached.
- Create new nodes from the left-side palette by dropping them into the editor.
- Create and reassign connections between step outputs and step inputs.
- Expand nodes to edit schedule times, prompt text, IVR output count, queue settings, operator parameters, transfer details, and voicemail settings.
- Delete selected nodes or connections, select all, zoom, fit to screen, reset the view, and toggle light or dark theme.
- Persist both the workflow state and the viewport transform in local storage.

## Foblex Flow Building Blocks Used

- `f-flow` as the workflow-editor root.
- `f-canvas` with `fZoom` for panning and scaling.
- `fExternalItem` with `fCreateNode` for palette-based node creation.
- `fNode`, `fNodeInput`, and `fNodeOutput` for call-flow steps and connectors.
- `fConnection` with segmented routing and `fConnectionMarkerArrow` for directional links.
- `fConnectionForCreate` for drag-to-connect creation.
- `fMoveNodes`, `fCreateConnection`, `fReassignConnection`, and `fSelectionChange` events for editor state updates.
- `fBackground`, `fCirclePattern`, `fLineAlignment`, `fSelectionArea`, and `fMinimap` for canvas tooling.

## Integration Notes

- The app keeps editor state in a local signal store and persists it to local storage.
- Each node type exposes its own Angular Material form, so configuration lives directly inside the flow node instead of a separate side panel.
- IVR output count is dynamic. When branch count is reduced, the app automatically removes now-invalid outbound connections from removed outputs.

## Run Locally

From this directory:

```bash
npm run dev
npm run build
npm run lint
```

Or from the workspace root:

```bash
npx nx serve call-center --configuration development
```

## Source

- Portal page: `https://flow.foblex.com/examples/call-center`
- App folder: `apps/example-apps/call-center`
