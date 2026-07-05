# Connector

**Selector:** `[fConnector]`  
**Class:** `FConnectorDirective`

`FConnectorDirective` is the **unified connector** for nodes. One directive covers all connector roles that previously required three separate directives:

- [`fNodeOutput`](f-node-output-directive) → `fConnectorType="source"`
- [`fNodeInput`](f-node-input-directive) → `fConnectorType="target"`
- [`fNodeOutlet`](f-node-outlet-directive) → `fConnectorType="outlet"`

A connector has **exactly one id** (`fConnectorId`); its behavior is controlled by `fConnectorType`.

Connectors must live inside a node (`[fNode]`) which is rendered inside [`f-canvas`](f-canvas-component) and [`f-flow`](f-flow-component).

## Connector types

```typescript
type FConnectorType = 'source' | 'target' | 'source-target' | 'outlet';
```

- `source` — can **start** a connection. Its id is referenced by `fSourceId` on [`f-connection`](f-connection-component).
- `target` — can **accept** a connection (drop-only; the user cannot start a drag from it). Its id is referenced by `fTargetId`.
- `source-target` _(default)_ — one id supports **both** behaviors: users can drag from it and drop onto it.
- `outlet` — a **shared start surface** for a node with multiple source connectors. It can start a drag-to-connect, but the persisted connection uses the id of a real `source` connector resolved inside the same node — the emitted `FCreateConnectionEvent.sourceId` is never the outlet id.

## Quick start

### Connector as a port element

```html
<f-flow fDraggable>
  <f-canvas>
    <div fNode [fNodePosition]="{ x: 120, y: 80 }">
      <div fDragHandle class="title">Node</div>

      <div fConnector fConnectorType="target" fConnectorId="in-1">In</div>
      <div fConnector fConnectorType="source" fConnectorId="out-1">Out</div>
    </div>
  </f-canvas>
</f-flow>
```

### Connector on the node itself

With the default `source-target` type, one connector on the node host lets users both start a connection from the node and drop a connection onto it.

```html
<f-flow fDraggable>
  <f-canvas>
    <div fNode fConnector fConnectorId="node-1" [fNodePosition]="{ x: 120, y: 80 }">
      Node (connector on host)
    </div>
  </f-canvas>
</f-flow>
```

### Connect it using `f-connection`

A persisted connection references connectors by their ids via `fSourceId` / `fTargetId`:

```html
<f-connection fSourceId="out-1" fTargetId="in-1"></f-connection>
```

> Tip: use **stable ids** (from your data model) if you want connections to survive rerenders and persistence.

## How it works

- The connector registers itself in the internal store together with its parent node.
- During drag-to-connect and reassignment, the library evaluates connectability rules such as `fConnectorDisabled`, `fConnectorMultiple`, `fConnectorCategory`, `fCanBeConnectedTo`, and `fConnectorConnectableSide`.
- The directive toggles CSS state classes (`connected` / `connectable` / `not-connectable`) so you can provide clear UX feedback with CSS.
- An `outlet` connector delegates to the `source` connectors of the same node: it is connectable only while at least one of them is.

## API

### Inputs

- `fConnectorId: InputSignal<string>;`  
  Connector identifier. Default: `f-connector-${uniqueId++}`.  
  Use a **stable** id if you store graph state and want connections to survive rerenders.

- `fConnectorType: InputSignal<FConnectorType>;`  
  Default: `'source-target'`. Controls the connector role (see “Connector types” above).

- `fConnectorDisabled: InputSignal<boolean>;`  
  Default: `false`. When `true`, the connector is not connectable.

- `fConnectorMultiple: InputSignal<boolean>;`  
  Default: `true`. When `false`, only one active connection can be attached to this connector.

- `fConnectorCategory: InputSignal<string | undefined>;`  
  Optional category used for connection validation rules (for example, “data”, “error”, “trigger”).  
  Categories are just strings — keep them consistent across your app.

- `fConnectorConnectableSide: EFConnectableSide;`  
  Default: `AUTO`. Controls the preferred docking side for routing/hit-testing (left/right/top/bottom/auto).  
  Use a fixed side when you have explicit port placement.

- `fConnectorSelfConnectable: boolean;`  
  Default: `true`. Allows connecting to target connectors on the same node. Applies when the connector can act as a source.

- `fCanBeConnectedTo: InputSignal<string[]>;`  
  Default: `[]` (no restriction). Allow-list of **target connector ids or categories** this connector may connect to. Applies when the connector can act as a source. Replaces the legacy `fCanBeConnectedInputs` — see [Connection Rules](connection-rules).

- `fConnectionFromOutlet: InputSignal<boolean>;`  
  Default: `false`. Outlet only: when `true`, the connection preview starts visually from the outlet rect. The emitted `FCreateConnectionEvent.sourceId` is always the resolved real source connector id.

### Types

#### FConnectorType

```typescript
type FConnectorType = 'source' | 'target' | 'source-target' | 'outlet';
```

#### EFConnectableSide

```typescript
enum EFConnectableSide {
  AUTO = 'auto',
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}
```

## Styling

Host classes:

- `.f-component` Base class for flow primitives.
- `.f-connector` Host class.
- `.f-connector-source` / `.f-connector-target` / `.f-connector-source-target` / `.f-connector-outlet` Applied by `fConnectorType`.
- `.f-connector-multiple` Applied when multiple connections are allowed.
- `.f-connector-disabled` Applied when disabled.

State classes (toggled at runtime):

- `.f-connector-connected` Applied when the connector currently has one or more connections.
- `.f-connector-connectable` Applied to valid targets during drag-to-connect.
- `.f-connector-not-connectable` Applied when the connector is currently blocked from connection.

Data attributes on the host element:

- `data-f-connector-id` The connector id.
- `data-f-connector-type` The connector type.

## Migration from legacy directives

| Legacy                                                   | Unified                                               |
| -------------------------------------------------------- | ----------------------------------------------------- |
| `fNodeOutput` / `fOutputId`                              | `fConnector fConnectorType="source"` / `fConnectorId` |
| `fNodeInput` / `fInputId`                                | `fConnector fConnectorType="target"` / `fConnectorId` |
| `fNodeOutlet` / `fOutletId`                              | `fConnector fConnectorType="outlet"` / `fConnectorId` |
| `fOutputMultiple` / `fInputMultiple`                     | `fConnectorMultiple` (default `true`)                 |
| `fOutputDisabled` / `fInputDisabled` / `fOutletDisabled` | `fConnectorDisabled`                                  |
| `fInputCategory`                                         | `fConnectorCategory`                                  |
| `fOutputConnectableSide` / `fInputConnectableSide`       | `fConnectorConnectableSide`                           |
| `isSelfConnectable`                                      | `fConnectorSelfConnectable`                           |
| `fCanBeConnectedInputs`                                  | `fCanBeConnectedTo`                                   |
| `isConnectionFromOutlet`                                 | `fConnectionFromOutlet`                               |
| `f-connection fOutputId` / `fInputId`                    | `f-connection fSourceId` / `fTargetId`                |

> Note: `fOutputMultiple` defaulted to `false`; `fConnectorMultiple` defaults to `true`. Set `[fConnectorMultiple]="false"` explicitly if you rely on single-connection sources — for example, an outlet advances to the next free source connector only when already-connected sources stop being connectable.

> Note: unlike the legacy registries, all `fConnector` ids live in a **single registry**. The legacy pattern of reusing the same id for a separate `fNodeOutput` and `fNodeInput` is not allowed for two `fConnector` elements — use one connector with the default `source-target` type instead.

The legacy directives keep working but are deprecated. A legacy connector and a unified connector can coexist in one flow, but do not mix both APIs on the same element.

## Notes and pitfalls

- `fConnectorId` must match connection `fSourceId` / `fTargetId` values **exactly** (case-sensitive). A typo silently results in “no connection rendered”.
- `target` connectors are **drop-only**: users cannot start a drag from them. Use `source-target` if the same port should work in both directions.
- With `fConnectorMultiple="false"`, the connector becomes unavailable after one active connection is attached.
- If you use `fConnectorCategory`, make sure `fCanBeConnectedTo` references the **same** category strings. Mismatched strings are the most common reason a connector becomes “not connectable”.
- An `outlet` needs at least one `source` connector inside the same node — otherwise there is nothing to resolve the created connection to.
- `fConnectorId` values are unique across **all** connector types: the same id cannot belong to both a `source` and a `target` connector (that was possible with legacy `fOutputId`/`fInputId`). One `source-target` connector covers that case.

## Example

::: ng-component <unified-connector></unified-connector> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/unified-connector/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/unified-connector/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/unified-connector/example.scss
:::
