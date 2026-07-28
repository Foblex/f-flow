---
allowDeprecatedApiExamples: true
publishedAt: "2026-07-27"
updatedAt: "2026-07-28"
---

# Migrating to Unified Connectors

Foblex Flow v19 introduced one `[fConnector]` directive for source, target, bidirectional, and outlet behavior. The legacy `fNodeOutput`, `fNodeInput`, `fNodeOutlet`, `fOutputId`, and `fInputId` APIs remain supported but are deprecated.

Migrate new and actively maintained templates to `fConnector`, `fSourceId`, and `fTargetId`. You can migrate one connection path at a time; do not place a legacy and unified connector directive on the same element.

## API mapping

| Legacy API                                     | Current API                                                |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `fNodeOutput fOutputId="out"`                  | `fConnector fConnectorId="out" fConnectorType="source"`    |
| `fNodeInput fInputId="in"`                     | `fConnector fConnectorId="in" fConnectorType="target"`     |
| `fNodeOutlet fOutletId="shared"`               | `fConnector fConnectorId="shared" fConnectorType="outlet"` |
| `fOutputConnectableSide`                       | `fConnectorConnectableSide`                                |
| `fInputConnectableSide`                        | `fConnectorConnectableSide`                                |
| `fOutputMultiple` / `fInputMultiple`           | `fConnectorMultiple`                                       |
| `fCanBeConnectedInputs`                        | `fCanBeConnectedTo`                                        |
| `isConnectionFromOutlet`                       | `fConnectionFromOutlet`                                    |
| `<f-connection fOutputId="out" fInputId="in">` | `<f-connection fSourceId="out" fTargetId="in">`            |
| event `fOutputId` / `fInputId`                 | event `sourceId` / `targetId`                              |

The multiplicity default changed. Legacy `fOutputMultiple` defaulted to `false`, while `fConnectorMultiple` defaults to `true`. Set `[fConnectorMultiple]="false"` on migrated source connectors when the old single-connection behavior must remain.

`fConnectorType` accepts:

- `source` — starts a connection;
- `target` — accepts a connection;
- `source-target` — can do both and is the default;
- `outlet` — shared outlet behavior.

## Before

```html
<f-connection fOutputId="request-out" fInputId="review-in" />

<div
  fNode
  fNodeOutput
  fOutputId="request-out"
  fOutputConnectableSide="right"
>
  Request
</div>

<div
  fNode
  fNodeInput
  fInputId="review-in"
  fInputConnectableSide="left"
>
  Review
</div>
```

## After

```html
<f-connection fSourceId="request-out" fTargetId="review-in" />

<div fNode>
  Request
  <span
    fConnector
    fConnectorId="request-out"
    fConnectorType="source"
    fConnectorConnectableSide="right"
  ></span>
</div>

<div fNode>
  Review
  <span
    fConnector
    fConnectorId="review-in"
    fConnectorType="target"
    fConnectorConnectableSide="left"
  ></span>
</div>
```

The connector may stay on the node host when the whole node is the endpoint, or move to a child port element when the UI exposes explicit handles.

## Update event handlers

Prefer the current fields when creating application records:

```ts
protected createConnection(event: FCreateConnectionEvent): void {
  if (!event.targetId) {
    return;
  }

  this.connections.update((connections) => [
    ...connections,
    {
      id: crypto.randomUUID(),
      sourceId: event.sourceId,
      targetId: event.targetId,
    },
  ]);
}
```

Deprecated event aliases remain for compatibility, but new code should not persist `fOutputId` or `fInputId`.

## Important id rule

Legacy output and input directives used separate registries, so some applications reused the same id once as an output and once as an input. Unified connectors share one registry: every rendered `fConnectorId` in a flow must be unique.

If one port is intentionally bidirectional, render one connector with the default `source-target` type. If two separate ports are required, give them different ids.

## Migration checklist

1. Change persisted connection fields to `sourceId` and `targetId`.
2. Bind connections with `fSourceId` and `fTargetId`.
3. Replace legacy connector directives with `fConnector`.
4. Map legacy rules, category, multiplicity, disabled state, and connectable side to the corresponding `fConnector*` inputs; preserve single-source behavior explicitly with `[fConnectorMultiple]="false"`.
5. Update create/reassign event handlers to current payload fields.
6. Verify connector ids are globally unique within the flow.
7. Exercise drag, click, and keyboard connection creation if those flows are enabled.
8. Keep the dev-mode `FF1001` diagnostic clean; it reports unresolved connection endpoint ids.

For the complete input and state-class reference, continue with [FConnectorDirective](f-connector-directive).
