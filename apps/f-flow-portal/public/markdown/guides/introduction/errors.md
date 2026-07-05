# Errors and Warnings

Foblex Flow reports misconfigurations with stable `FFxxxx` codes. Dev-mode warnings are emitted once per cause and stripped from production builds; errors keep their code in all builds. Each code below lists the cause and the fix.

## FF1001

**Warning: connection endpoint not found.**

A `<f-connection>` references an `fSourceId` / `fTargetId` that does not match any rendered connector, so the connection is not drawn. The warning lists the currently registered connector ids.

Causes and fixes:

- The id does not match a `fConnectorId` (or legacy `fOutputId` / `fInputId`) exactly — comparison is string-based, so a number `1` from one source and a string `'1'` from another do match after normalization, but `out-1` vs `out_1` do not.
- The connector's node is not rendered (wrong `@for` source, filtered out, or outside `<f-canvas>`).
- The connection is rendered before its connectors — during a progressive (`*fVirtualFor`) render this is a normal transient state and is not reported.

## FF1002

**Warning: `f-flow` has zero height.**

Everything compiled and rendered, but the host element has `clientHeight === 0`, so the flow is invisible. Give the host a height:

```scss
f-flow {
  display: block;
  height: 600px;
}
```

Any nonzero layout height works (flex/grid tracks included). See [Get Started](get-started).

## FF1003

**Error: connector used outside a node.**

`[fConnector]`, `[fNodeOutput]`, `[fNodeInput]`, and `[fNodeOutlet]` must be placed on an element inside `[fNode]` or `[fGroup]` — the connector registers itself with its host node. Move the connector inside a node template:

```html
<div fNode [fNodePosition]="{ x: 0, y: 0 }">
  <div fConnector fConnectorType="source" fConnectorId="out-1"></div>
</div>
```

## FF1004

**Warning: flow content is not projected into the canvas.**

A node, group, or connection is rendered inside a template block that Angular does not project into `<f-canvas>` — typically **nested control flow** (`@for` inside `@if`, `@for` inside `@for`, `@if` inside `@if`) or a wrapper element. Angular still creates the instances (they register with the flow), but their elements never attach to the document: geometry collapses to 0×0 and nothing is visible. Without this warning the failure is completely silent — there is no Angular error.

Fix: wrap the block with an `ng-container` that tells Angular which canvas slot the content belongs to:

```html
@if (isEditable()) {
  <ng-container ngProjectAs="[fNodes]">
    @for (node of nodes(); track node.id) {
      <div fNode [fNodePosition]="node.position">{{ node.label }}</div>
    }
  </ng-container>

  <ng-container ngProjectAs="[fConnections]">
    @for (connection of connections(); track connection.id) {
      <f-connection [fSourceId]="connection.source" [fTargetId]="connection.target" />
    }
  </ng-container>
}
```

Use `ngProjectAs="[fNodes]"` for nodes, `"[fGroups]"` for groups, `"[fConnections]"` for connections. A single top-level `@for` / `@if` directly inside `<f-canvas>` projects fine and needs no wrapper.

## FF1005

**Warning: interaction feature without `fDraggable`.**

An interaction feature (`<f-selection-area>`, `<f-connection-for-create>`, `<f-snap-connection>`, `[fDragHandle]`, `[fResizeHandle]`, `[fRotateHandle]`) is present, but `<f-flow>` has no `fDraggable` directive — every pointer interaction is silently inert and no interaction events are emitted.

Fix: add `fDraggable` to the root:

```html
<f-flow fDraggable>
  ...
</f-flow>
```

## FF1006

**Warning: connector hidden with CSS.**

A connector is registered but hidden (`display: none`), so its geometry is a 0×0 point: connections attach to the wrong place or nowhere, and viewport helpers compute wrong bounds. Hiding registered flow elements with CSS (including `[hidden]`) corrupts geometry silently.

Fix: conditionally render the connector (or its node) from state instead of hiding it — wrapping control-flow blocks with `ngProjectAs` where needed (see FF1004).

## FF1007

**Warning: node nested inside another node.**

An `[fNode]` / `[fGroup]` element is a DOM descendant of another node element — usually a wrapper `div` with `fNode fDragHandle` around a component that also declares `fNode`. The outer node wins the drag and bindings on the inner one never fire.

Fix: exactly one `fNode` per node, as siblings inside `<f-canvas>`; hierarchy is id-based via `fNodeParentId` / `fGroupParentId`, not DOM-based.

## FF1008

**Warning: parent id not found.**

`fNodeParentId` / `fGroupParentId` references an id that no rendered node or group has, so hierarchy behaviors (containment, group drag, auto-size) silently do not apply. The warning lists the registered ids.

Fix: reference an existing group id, and keep ids stable across re-renders.

## FF1009

**Warning: viewport helper called before nodes were rendered.**

`fitToScreen()`, `resetScaleAndCenter()`, or `centerGroupOrNode()` was called before the nodes were rendered (e.g. from `ngOnInit` / `ngAfterViewInit`), so it computes against an incomplete node set and produces a wrong initial viewport.

These helpers compute from the nodes bounding box, so `(fNodesRendered)` is the earliest safe moment — connections do not affect the result. `(fFullRendered)` also works:

```html
<f-flow fDraggable (fNodesRendered)="canvas.fitToScreen()">
  <f-canvas #canvas> ... </f-canvas>
</f-flow>
```

## Verifying a flow programmatically

To assert a flow is fully wired (useful in tests and for AI agents):

1. Listen to `(fFullRendered)` on `<f-flow>`.
2. Call `flow.getState()` and check every declared connection resolved to existing connectors.
3. In dev mode, an empty console (no `FFxxxx` warnings) after the first render means ids, hierarchy, and sizing are consistent.
