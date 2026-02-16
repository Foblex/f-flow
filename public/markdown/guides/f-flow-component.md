# Flow

**Selector:** `f-flow`  
**Class:** `FFlowComponent`

`f-flow` is the **required root container** for every diagram in Foblex Flow.  
All primitives (`f-canvas`, nodes, connectors, connections, and extensions) must be placed under a single `f-flow`.

## Role in the hierarchy

`f-flow` bootstraps the internal runtime and acts as the main integration point for:

- registration of nodes/connectors/connections,
- selection and utility APIs,
- extension components/directives like `fDraggable`, `fZoom`, minimap, magnetic helpers, etc.

> If you render a diagram with Foblex Flow, you always start with `f-flow`.

## What it’s for

Use `f-flow` when you need:

- a predictable place to listen for “ready” (`fLoaded`),
- imperative APIs for selection, bounding boxes, and exporting the current flow state,
- a host for extensions like `fDraggable`, minimap, magnetic helpers, etc.

> Foblex Flow is “interaction + rendering infrastructure”.  
> Your application still owns the **data model** (nodes list, positions, connections, persistence).

## How it works

`f-flow` registers itself in the internal store, watches data changes, redraws connection layers, and emits `fLoaded` once initial rendering stabilizes. Public methods like `select`, `clearSelection`, and `getState` call into that same store.

## API

### Inputs

- `fFlowId: InputSignal<string>;` The unique identifier for the flow instance. Default: `f-flow-${uniqueId++}`

### Outputs

- `fLoaded: OutputEmitterRef<string>;` Emits once when the first full render is ready. Payload is the current flow id.
  Typical usage: center the canvas, apply initial zoom, or run any logic that requires all nodes to be registered.

### Methods

- `redraw(): void;` Forces a redraw of nodes and connections.

- `reset(): void;` Resets internal loaded state. Next render will emit `fLoaded` again.

- `getNodesBoundingBox(): IRect | null;` Returns a bounding rectangle that covers **all nodes and groups** in the current flow.

- `getSelection(): ICurrentSelection;` Returns selected node/group/connection ids.

- `getPositionInFlow(position: IPoint): IRect;` Converts a point from the viewport into flow coordinates (relative to the flow).

- `getState(): IFFlowState;` Exports the full flow state: nodes, groups and connections (including their current transforms/positions).

- `selectAll(): void;` Selects all selectable items.

- `select(nodesAndGroups: string[], connections: string[], isSelectedChanged: boolean = true): void;` Selects the specified nodes, groups and connections.

- `clearSelection(): void;` Clears current selection.

> These “imperative” APIs are meant for toolbars, keyboard shortcuts, and integration with external UI (side panels, inspectors, etc.).

### Types

#### IPoint

```typescript
interface IPoint {
  x: number;
  y: number;
}
```

#### IRect

```typescript
interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

#### IFFlowState

```typescript
interface IFFlowState {
  nodes: IFNodeState[];
  groups: IFGroupState[];
  connections: IFConnectionState[];
}
```

#### ICurrentSelection

```typescript
interface ICurrentSelection {
  nodes: string[];
  connections: string[];
}
```

## Styling

- `.f-component` Base class for flow primitives.
- `.f-flow` Host class for the root container.
- `.f-node`, `.f-group`, `.f-connection` Internal layout classes used by flow rendering.

## Notes / Pitfalls

- `fLoaded` is one-time per internal load cycle; if you call `reset()`, a later render can emit again.
- Programmatic `select(...)` runs after data-change notification, so call it when ids are already present in the flow.

## Example

::: ng-component <custom-nodes></custom-nodes> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/custom-nodes/custom-nodes.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/custom-nodes/custom-nodes.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/nodes/custom-nodes/custom-nodes.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
