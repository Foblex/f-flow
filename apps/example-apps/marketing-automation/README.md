# Marketing Automation

Standalone Angular reference app for building marketing journeys with Foblex Flow.

## Interaction Model

- Campaign steps are positioned by Dagre and cannot be dragged manually.
- The canvas remains pannable and zoomable.
- A step can be inserted from the plus control on any existing connection.
- Every open output ends in a derived plus node that continues that branch.
- Both placements render the same `CampaignAddButton` and the same searchable picker.
- Keyboard navigation can select a derived plus node; pressing `Enter` opens the same picker as a pointer click.

Only real campaign nodes and connections are persisted. Add-slot nodes and their dashed connections are derived UI geometry created by `CampaignLayoutCoordinator` before each layout pass.

## Architecture

- `CampaignState` owns typed Flow records and domain mutations.
- `CampaignEditorController` coordinates editor operations, history transactions, persistence, and selection.
- `CampaignLayoutCoordinator` derives open-output slots and runs the Dagre layout.
- `CampaignStorage` stores the domain snapshot and layout direction in local storage.
- Focused node, toolbar, picker, and inspector components own their respective presentation behavior.

Structural operations wrap the domain mutation and asynchronous layout in `beginBatch()` / `endBatch()`. Calculated positions amend the active item, so inserting or deleting a step and moving every affected node requires one undo.

Single-node selection uses the same transaction boundary for its animated viewport centering. `resetScaleAndCenterGroupOrNode()` restores zoom to `1`, while the example captures the resulting canvas transform inside the open batch. Selection and centering are therefore one undo item and one persistence update.

## Foblex Flow Features

- State plugin with typed records, undo, redo, and batching.
- Dagre manual layout with the longest-path ranker.
- Accessibility plugin and default control scheme.
- Unified connectors and connection content.
- Fixed segmented connections, markers, minimap, background, pan, and zoom.

## Run Locally

From this directory:

```bash
npm run dev
npm run build
npm run lint
```

Or from the workspace root:

```bash
npm run dev:marketing-automation
```

## Source

- Portal page: `https://flow.foblex.com/examples/marketing-automation`
- App folder: `apps/example-apps/marketing-automation`
