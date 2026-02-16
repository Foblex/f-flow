# Connection

**Selector:** `f-connection`  
**Class:** `FConnectionComponent`

`FConnectionComponent` renders a **connection** (edge) between a source connector (`fOutputId`) and a target connector (`fInputId`).
In most apps, connections are **persisted** in your own state (array/map) and rendered from that state on each change.

Connections must be placed inside [`f-canvas`](f-canvas-component) (which itself must be inside [`f-flow`](f-flow-component)).

## When to use it

Use `f-connection` for **existing (persisted) links** in the diagram:

- render edges from your graph model
- style edges (type, behavior, colors, markers)
- allow users to select and/or reassign edges (if enabled)

For the **drag preview** while the user is creating a new link, use
[`f-connection-for-create`](f-connection-for-create-component) and optionally [`f-snap-connection`](f-snap-connection-component).

## How it works

- The connection resolves its endpoints by `fOutputId` and `fInputId`.
- It builds an SVG path using the chosen `fType` and `fBehavior`.
- During interactions the library updates visuals smoothly internally.
- **Your app typically persists changes on final events** (for example after a reassign drag ends).

## API

### Inputs

- `fConnectionId: InputSignal<string>;`  
  Connection identifier. Default: `f-connection-${uniqueId++}`.  
  Use a **stable** id if you want selection state to survive rerenders.

- `fOutputId: InputSignal<string>;`  
  Source connector id (from `[fNodeOutput]` or `[fNodeOutlet]`).

- `fInputId: InputSignal<string>;`  
  Target connector id (from `[fNodeInput]`).

- `fReassignDisabled: InputSignal<boolean>;`  
  Default: `false`.  
  Disables reassign interaction for this connection.

- `fSelectionDisabled: InputSignal<boolean>;`  
  Default: `false`.  
  Disables selecting this connection.

- `fStartColor: InputSignal<string>;`  
  Default: `black`.  
  Start color for the path gradient.

- `fEndColor: InputSignal<string>;`  
  Default: `black`.  
  End color for the path gradient.

- `fBehavior: InputSignal<EFConnectionBehavior>;`  
  Default: `EFConnectionBehavior.FIXED`.  
  Controls how the line behaves relative to endpoints (fixed/floating/etc.).  
  See the example section for behavior presets.

- `fType: InputSignal<EFConnectionType | string>;`  
  Default: `EFConnectionType.STRAIGHT`.  
  Controls which path builder is used (straight/bezier/segment/adaptive-curve or custom key).

- `fOffset: InputSignal<number>;`  
  Default: `12`.  
  Minimum “straight” length before a curve/turn may appear (depends on type).

- `fRadius: InputSignal<number>;`  
  Default: `8`.  
  Radius used for rounded corners (depends on type).

- `fReassignableStart: InputSignal<boolean>;`
  Default: `false`.
  Enables reassigning the start endpoint of the connection (output-side) by dragging it, just like end reassign. This feature is available in the library, but disabled by default.

### Outputs

`f-connection` does not emit its own outputs.  
Creation/reassign events are emitted from `f-flow[fDraggable]` (see [Event System](event-system)).

### Types

#### EFConnectionBehavior

```typescript
enum EFConnectionBehavior {
  FIXED = 'fixed',
  FLOATING = 'floating',
}
```

#### EFConnectionType

```typescript
enum EFConnectionType {
  STRAIGHT = 'straight',
  BEZIER = 'bezier',
  SEGMENT = 'segment',
}
```

## Styling

These classes are useful when styling the SVG and interaction affordances:

- `.f-connection` host class
- `.f-selected` applied when selected
- `.f-connection-selection-disabled` applied when `fSelectionDisabled = true`
- `.f-connection-reassign-disabled` applied when `fReassignDisabled = true`
- `.f-connection-path` main SVG path
- `.f-connection-selection` invisible hit-path (easier selection)
- `.f-connection-drag-handle` endpoint drag handle circles
- `.f-connection-content` projected content container (if you project content)

## Notes and pitfalls

- `fOutputId` / `fInputId` must point to **existing connectors**; otherwise the connection cannot resolve endpoints.
- If you use a custom `fType`, ensure the corresponding connection type is registered (see the custom type example).
- Keep `fSelectionDisabled` and `fReassignDisabled` explicit per connection for predictable UX in mixed graphs.

## Examples

### Connection types

::: ng-component <connection-types></connection-types> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-types/connection-types.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-types/connection-types.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-types/connection-types.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

### Connection behaviors

::: ng-component <connection-behaviours></connection-behaviours> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-behaviours/connection-behaviours.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-behaviours/connection-behaviours.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-behaviours/connection-behaviours.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-behaviours/connection-behaviours.scss
:::

### Custom connection type

::: ng-component <custom-connection-type></custom-connection-type> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-connection-type/custom-connection-type.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-connection-type/custom-connection-type.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/custom-connection-type/custom-connection-type.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

### Reassign example

::: ng-component <drag-to-reassign></drag-to-reassign> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-reassign/drag-to-reassign.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-reassign/drag-to-reassign.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-reassign/drag-to-reassign.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
