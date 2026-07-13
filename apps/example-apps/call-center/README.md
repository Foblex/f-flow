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
- `fNode` and the unified `fConnector` API for call-flow steps and connectors.
- `fConnection` with segmented routing and `fConnectionMarkerArrow` for directional links.
- `fConnectionForCreate` for drag-to-connect creation.
- `withFlowState()` for typed records, automatic gesture updates, undo/redo, and persistence.
- `withReflowOnResize()` for moving downstream steps when an embedded form changes node size.
- `withA11y()` and the default control scheme for keyboard and pointer interaction.
- `fBackground`, `fCirclePattern`, `fLineAlignment`, `fSelectionArea`, and `fMinimap` for canvas tooling.

## Integration Notes

- `CallCenterFlowState` owns editor history and domain commands; it delegates persistence to `CallCenterFlowStorage` and record construction to domain factories.
- Each node type exposes its own Angular Material form, so configuration lives directly inside the flow node instead of a separate side panel.
- IVR output count is dynamic. When branch count is reduced, the app automatically removes now-invalid outbound connections from removed outputs.

## One History Item for Expand and Reflow

Expanding a node updates `isExpanded` immediately, but `withReflowOnResize()` moves downstream nodes later, after Angular renders the new size and `ResizeObserver` runs. A synchronous `batch()` would close too early and create two undo items.

The state keeps one transaction open across that rendering turn:

```ts
function afterResizeObserverTurn(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

public async setNodeExpanded(nodeId: string, isExpanded: boolean): Promise<void> {
  this.beginBatch();

  try {
    this.updateNode(nodeId, { isExpanded });
    await afterResizeObserverTurn();
  } finally {
    this.endBatch();
  }
}
```

The state controller receives reflow's later `fMoveNodes` event while the transaction is open. One `undo()` then restores both `isExpanded` and every shifted position. If node size settles after a transition, lazy load, or another asynchronous operation, close the transaction from that operation's completion signal instead of relying on two animation frames.

The expand button also uses `fDragBlocker` because it lives inside `fDragHandle`. Without the blocker, the click can select the node first; when `selectionInHistory` is enabled, that intentional selection becomes a separate undo item before expand/reflow.

Full guide: <https://flow.foblex.com/examples/state>

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
