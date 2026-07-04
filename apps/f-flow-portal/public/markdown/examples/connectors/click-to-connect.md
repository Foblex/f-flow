---
toc: false
wideContent: true
publishedAt: "2026-07-04"
updatedAt: "2026-07-04"
---

# Click to Connect

## Description

Create connections without dragging: click a source connector to start, the preview line follows the cursor, then click a connectable target to commit. Pressing `Escape` or clicking anywhere else cancels; clicking another source re-arms from it. Drag-to-connect keeps working alongside — both gestures share the same preview, snapping, validation, and emit the same `fCreateConnection` event.

## Example

::: ng-component <click-to-connect></click-to-connect> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/click-to-connect/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/click-to-connect/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/click-to-connect/example.scss
:::

## Usage

Select the connection gesture through `provideFFlow`:

```typescript
import { provideFFlow, withConnectionFlow } from '@foblex/flow';

@Component({
  providers: [provideFFlow(withConnectionFlow('click'))],
})
export class MyFlow {}
```

- `'drag'` — the default drag-to-connect only (same as omitting the feature).
- `'click'` — adds click-to-connect alongside drag.
- A custom `Type<IFConnectionFlow>` installs your own gesture: implement `initialize()` / `destroy()` and drive the shared `FCreateConnectionSession` (`begin`, `update`, `resolveTarget`, `complete`, `cancel`) to reuse the preview line, snapping, connectable marking, and event emission.

The connection rules are unchanged: `fConnectorDisabled`, `fCanBeConnectedTo`, categories, and multiplicity apply to both gestures, and `<f-connection-for-create>` remains the opt-in for the preview.
