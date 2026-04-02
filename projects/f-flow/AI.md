# AI Guide for `@foblex/flow`

Use this file as a strict control layer for code generation. Prefer verified package API and examples over assumptions.

## What This Library Is

`@foblex/flow` is an Angular-native library for building node-based editors, workflow builders, and interactive graph UIs.
It provides rendering, connectors, interactions, selection, zoom, and connection drawing. Your app still owns the graph data.

## Core Mental Model

- The library does **not** own your graph state.
- Your app owns nodes, groups, connections, ids, validation, and persistence.
- Angular templates render the current state.
- User actions emit events from `fDraggable` or model outputs.
- Your app updates state.
- Angular rerenders.

## Verified Building Blocks

- `<f-flow>`: root flow host.
- `<f-canvas>`: canvas/viewport container.
- `[fNode]` and `[fGroup]`: place nodes and groups in the template.
- `[fNodeOutput]` with `fOutputId`: output connector.
- `[fNodeInput]` with `fInputId`: input connector.
- `[fNodeOutlet]`: outlet-style connector surface for advanced connection creation patterns.
- `<f-connection>`: render an existing connection between connectors.
- `<f-connection-for-create>`: optional preview connection used during drag-to-connect UX.
- `fDraggable` on `<f-flow>`: enables pointer interactions and emits interaction events.

## Hard Rules

- Never invent Inputs, Outputs, methods, directives, or selectors.
- Do **not** assume React Flow style APIs such as `[nodes]`, `[edges]`, `setNodes()`, `addEdge()`, `useNodesState()`, or similar patterns.
- Do **not** assume a built-in graph store. The app owns state.
- Connections are connector-to-connector, not generic node-to-node edges.
- Template connections use `fOutputId -> fInputId`.
- Do **not** interpret `[fNodes]` or `[fConnections]` as graph-state inputs. In this package they are content-projection markers used with `ngProjectAs` in some examples.
- Examples may include app-specific state, layout logic, persistence, undo/redo, toolbars, or validation. Those are example implementations, not built-in package features.
- Some exports are low-level, compatibility-oriented, or testing-oriented. Do not treat every export from `@foblex/flow` as the recommended app-facing API.
- If a symbol, selector, event, or behavior is not confirmed in the installed package, say: `not found in @foblex/flow`.

## Correct Usage Pattern

- Render nodes and groups from your Angular state using normal Angular templates.
- Put connectors on the node element itself or on child elements with `fNodeOutput` / `fNodeInput`.
- Render persisted connections explicitly with `<f-connection>`.
- Add `fDraggable` to `<f-flow>` when you want drag, selection, connect, reassign, or drop interactions.
- Handle events such as `fCreateConnection`, `fReassignConnection`, `fMoveNodes`, `fSelectionChange`, `fCreateNode`, `fDropToGroup`, and `fConnectionWaypointsChanged`.
- Update your own state in those handlers, then let Angular rerender.
- Use node/group position bindings and change outputs to keep positions in app state when needed.

## Naming Distinction

- In templates, connector ids are `fOutputId` and `fInputId`.
- In `FCreateConnectionEvent`, prefer `sourceId`, `targetId`, and `dropPosition`.
- `FCreateConnectionEvent` still exposes legacy aliases `fOutputId`, `fInputId`, and `fDropPosition`.
- In `FReassignConnectionEvent`, prefer `connectionId`, `endpoint`, `previousSourceId`, `nextSourceId`, `previousTargetId`, `nextTargetId`, and `dropPosition`.
- `FReassignConnectionEvent` still exposes legacy aliases such as `oldSourceId`, `newSourceId`, `oldTargetId`, `newTargetId`, and `dropPoint`.
- Other current event classes also prefer non-`f*` names when both versions exist, for example `nodeIds` over `fNodeIds` and `nodes` over `fNodes`.
- Examples may still show compatibility names in handlers. Prefer the current non-deprecated event property names when generating new code.

## Styling

See [STYLING.md](./STYLING.md).

## Fallback Rule

If something cannot be verified from the installed package, answer with: `not found in @foblex/flow`.
