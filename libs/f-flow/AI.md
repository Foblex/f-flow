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

## Minimal Working Setup

Three files must be correct at the same time. Missing any one produces a blank or inert canvas, usually without errors.

```typescript
// component — FFlowModule is required: fNode, fConnector, f-connection are not standalone
import { FFlowModule } from '@foblex/flow';

@Component({
  standalone: true,
  imports: [FFlowModule],
  templateUrl: './flow.html',
  styleUrl: './flow.scss',
})
export class Flow {}
```

```html
<!-- template — the hierarchy f-flow > f-canvas > fNode/f-connection is mandatory -->
<f-flow fDraggable>
  <f-canvas>
    <f-connection fSourceId="out-1" fTargetId="in-1"></f-connection>

    <div fNode fDragHandle [fNodePosition]="{ x: 100, y: 100 }">
      Node A
      <div fConnector fConnectorType="source" fConnectorId="out-1"></div>
    </div>
    <div fNode fDragHandle [fNodePosition]="{ x: 320, y: 100 }">
      Node B
      <div fConnector fConnectorType="target" fConnectorId="in-1"></div>
    </div>
  </f-canvas>
</f-flow>
```

```scss
/* styles — f-flow must have a nonzero height or nothing is visible */
f-flow {
  display: block;
  height: 600px;
}
```

The default theme is wired by `ng add @foblex/flow` (adds `node_modules/@foblex/flow/styles/default.scss` to `angular.json`). Without a theme, nodes and connections render unstyled or invisible.

## Verified Building Blocks

- `<f-flow>`: root flow host.
- `<f-canvas>`: canvas/viewport container.
- `[fNode]` and `[fGroup]`: place nodes and groups in the template.
- `[fConnector]` with `fConnectorId` and `fConnectorType` (`'source' | 'target' | 'source-target' | 'outlet'`): the **unified connector**. Preferred for new code.
- `[fNodeOutput]` / `[fNodeInput]` / `[fNodeOutlet]`: legacy connectors, still supported, deprecated in favor of `fConnector`.
- `<f-connection>` with `fSourceId` / `fTargetId`: render an existing connection between connectors (`fOutputId` / `fInputId` are deprecated aliases).
- `<f-connection-for-create>`: optional preview connection used during drag-to-connect UX.
- `fDraggable` on `<f-flow>`: enables pointer interactions and emits interaction events.
- `fZoom` on `<f-canvas>`: opt-in wheel / double-click / pinch zoom.
- `<f-selection-area>`: opt-in rectangle multi-select.
- `provideFFlow(...)` with features: `withControlScheme(...)` (gesture-to-action mapping, presets `F_DEFAULT_CONTROL_SCHEME`, `F_SCROLL_PAN_CONTROL_SCHEME`, `F_DRAG_SELECT_CONTROL_SCHEME`), `withReflowOnResize(...)` (auto layout on node resize), `withFCanvas(...)` (canvas defaults such as layer order).

## Hard Rules

- Never invent Inputs, Outputs, methods, directives, or selectors.
- Do **not** assume React Flow style APIs such as `[nodes]`, `[edges]`, `setNodes()`, `addEdge()`, `useNodesState()`, `<Handle>`, `<Background>`, `<Controls>`, or similar patterns.
- Do **not** assume a built-in graph store. The app owns state.
- Connections are connector-to-connector, not generic node-to-node edges.
- Template connections use `fSourceId -> fTargetId` referencing `fConnectorId` values (legacy: `fOutputId -> fInputId` referencing output/input ids).
- Do **not** interpret `[fNodes]` or `[fConnections]` as graph-state inputs. They are content-projection slot markers used with `ngProjectAs` (see the nested control flow rule below).
- **Nested control flow requires `ngProjectAs`.** Nodes, groups, or connections rendered inside nested template blocks (`@for` in `@if`, `@for` in `@for`, `@if` in `@if`, or a wrapper element) are NOT projected into the canvas — Angular creates them detached, geometry collapses to 0×0, and nothing renders, with no error. Wrap such blocks:

  ```html
  @if (isEditable()) {
    <ng-container ngProjectAs="[fNodes]">
      @for (node of nodes(); track node.id) {
        <div fNode [fNodePosition]="node.position">{{ node.label }}</div>
      }
    </ng-container>
    <ng-container ngProjectAs="[fConnections]">
      @for (c of connections(); track c.id) {
        <f-connection [fSourceId]="c.source" [fTargetId]="c.target" />
      }
    </ng-container>
  }
  ```

  Use `"[fNodes]"` for nodes, `"[fGroups]"` for groups, `"[fConnections]"` for connections. A single top-level `@for` / `@if` directly inside `<f-canvas>` needs no wrapper.

- Examples may include app-specific state, layout logic, persistence, undo/redo, toolbars, or validation. Those are example implementations, not built-in package features.
- Some exports are low-level, compatibility-oriented, or testing-oriented. Do not treat every export from `@foblex/flow` as the recommended app-facing API.
- If a symbol, selector, event, or behavior is not confirmed in the installed package, say: `not found in @foblex/flow`.

## Correct Usage Pattern

- Render nodes and groups from your Angular state using normal Angular templates.
- Put connectors on the node element itself or on child elements with `fConnector`.
- Render persisted connections explicitly with `<f-connection>`.
- Add `fDraggable` to `<f-flow>` when you want drag, selection, connect, reassign, or drop interactions.
- Handle events such as `fCreateConnection`, `fReassignConnection`, `fMoveNodes`, `fSelectionChange`, `fCreateNode`, `fDropToGroup`, and `fConnectionWaypointsChanged`.
- Update your own state in those handlers, then let Angular rerender.
- Use node/group position bindings and change outputs to keep positions in app state when needed.

## Common Silent Failures — Check These First

When the flow compiles but looks wrong, verify in this order:

1. **Connection not visible**: `fSourceId` / `fTargetId` does not match any rendered `fConnectorId` exactly (string comparison; `1` vs `'1'` from different sources is a classic mismatch). The connection silently does not render.
2. **Blank canvas**: `f-flow` has zero height, or the theme SCSS is not wired in `angular.json`.
3. **`'f-flow' is not a known element`** or connectors not working: `FFlowModule` missing from the component `imports`.
4. **Nothing is draggable / no events fire**: `fDraggable` missing on `<f-flow>`.
5. **Wheel does nothing**: `fZoom` missing on `<f-canvas>` (zoom is opt-in).
6. **Node ignores position**: `[fNodePosition]` must be a property binding to `{ x, y }`, and nodes must be direct content of `<f-canvas>`.
7. **`[f-flow][FF1003]` error**: a connector is placed outside an `[fNode]` / `[fGroup]` element.
8. **Nodes/connections exist in state but nothing renders, no errors** (`FF1004` warns in dev mode): flow content sits inside nested `@if`/`@for` blocks without `<ng-container ngProjectAs="[fNodes]">` (`"[fGroups]"` / `"[fConnections]"`) — see the Hard Rules section.
9. **Handles/selection/connect present but inert** (`FF1005`): `fDraggable` is missing on `<f-flow>` while `fDragHandle` / `f-selection-area` / `f-connection-for-create` / resize / rotate are used.
10. **Connections attach to the wrong place** (`FF1006`): a connector is hidden with CSS (`display: none`) — its geometry is a 0×0 point. Conditionally render instead of hiding.
11. **Node moves but its bindings never fire** (`FF1007`): an `fNode` element is nested inside another node element. One `fNode` per node; hierarchy is id-based (`fNodeParentId`), not DOM-based.
12. **Group behaviors don't apply** (`FF1008`): `fNodeParentId` / `fGroupParentId` references an id no rendered group has.
13. **Wrong initial viewport** (`FF1009`): `fitToScreen()` / `resetScaleAndCenter()` / `centerGroupOrNode()` called before the first `(fFullRendered)`.

To verify programmatically: listen to `(fFullRendered)` on `<f-flow>`, then call `flow.getState()` and assert every declared connection resolved to existing connectors.

## Additional Rules

- The library runs outside the Angular zone: its events do not trigger change detection. With OnPush or zoneless apps, replace arrays/objects (new references) instead of mutating, and call `markForCheck()` where needed.
- Always set stable, app-owned ids on nodes and connections; auto-generated ids (`f-connection-3`) cannot be mapped back to your model and break selection/persistence across re-renders.
- Style flow internals (connection paths, minimap, markers) in global styles or via `::ng-deep` — component-scoped CSS never reaches them. Wire the default theme via `ng add`.
- Do not combine `fAutoSizeToFitChildren` with restoring a persisted group size in the same render: pass `false` while restoring, enable it afterwards.
- With several `<f-flow>` instances on one page, keep `fDraggable` enabled only on the active flow.
- Connections define `SELECTED_START` / `SELECTED_END` marker variants in addition to `START` / `END`, or markers disappear when the connection is selected.
- An empty `fCanBeConnectedTo` allow-list means "no restriction", not "allow nothing"; category strings must match exactly.
- Above ~500 nodes enable `[fCache]` on `<f-flow>` and render nodes with `*fVirtualFor` inside `<ng-container ngProjectAs="[fNodes]">`.

## Naming Distinction

- In templates, connector ids are `fConnectorId` (unified) or legacy `fOutputId` / `fInputId`; connection endpoints are `fSourceId` / `fTargetId`.
- In `FCreateConnectionEvent`, prefer `sourceId`, `targetId`, and `dropPosition`.
- `FCreateConnectionEvent` still exposes legacy aliases `fOutputId`, `fInputId`, and `fDropPosition`.
- In `FReassignConnectionEvent`, prefer `connectionId`, `endpoint`, `previousSourceId`, `nextSourceId`, `previousTargetId`, `nextTargetId`, and `dropPosition`.
- `FReassignConnectionEvent` still exposes legacy aliases such as `oldSourceId`, `newSourceId`, `oldTargetId`, `newTargetId`, and `dropPoint`.
- Other current event classes also prefer non-`f*` names when both versions exist, for example `nodeIds` over `fNodeIds` and `nodes` over `fNodes`.
- Examples may still show compatibility names in handlers. Prefer the current non-deprecated event property names when generating new code.

## Styling

See [STYLING.md](./STYLING.md).

## More Documentation

- Full LLM-readable reference: https://flow.foblex.com/llms-full.txt
- Docs index for agents: https://flow.foblex.com/llms.txt
- Human docs: https://flow.foblex.com/docs/get-started
- Live examples with source: https://flow.foblex.com/examples/overview

## Fallback Rule

If something cannot be verified from the installed package, answer with: `not found in @foblex/flow`.
