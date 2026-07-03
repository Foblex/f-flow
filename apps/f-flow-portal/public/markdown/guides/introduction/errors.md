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

## Verifying a flow programmatically

To assert a flow is fully wired (useful in tests and for AI agents):

1. Listen to `(fFullRendered)` on `<f-flow>`.
2. Call `flow.getState()` and check every declared connection resolved to existing connectors.
3. In dev mode, an empty console (no `FFxxxx` warnings) after the first render means ids, hierarchy, and sizing are consistent.
