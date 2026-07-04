import { Type } from '@angular/core';
import { EFFlowFeatureKind, IFFlowFeature } from '../../../provide-f-flow';
import { F_CONNECTION_FLOW, IFConnectionFlow } from './i-f-connection-flow';
import { FClickConnectFlow } from './f-click-connect-flow';

/**
 * Selects the connection-creation gesture inside `provideFFlow(...)`.
 *
 * ```typescript
 * @Component({
 *   providers: [provideFFlow(withConnectionFlow('click'))],
 * })
 * export class MyFlow {}
 * ```
 *
 * - `'drag'` — the default drag-to-connect only (same as omitting the feature).
 * - `'click'` — adds click-to-connect: click a source connector, the preview follows the
 *   cursor, click a connectable target to commit; `Escape` or clicking elsewhere
 *   cancels. Drag-to-connect keeps working alongside.
 * - A custom `Type<IFConnectionFlow>` installs your own gesture strategy; drive the
 *   shared `FCreateConnectionSession` to reuse the preview, snapping, validation, and
 *   event emission.
 *
 * Registering the feature twice replaces the earlier strategy via Angular's last-wins
 * provider semantics.
 */
export function withConnectionFlow(
  flow: 'drag' | 'click' | Type<IFConnectionFlow>,
): IFFlowFeature<EFFlowFeatureKind.CONNECTION_FLOW> {
  return {
    kind: EFFlowFeatureKind.CONNECTION_FLOW,
    providers:
      flow === 'drag'
        ? []
        : [{ provide: F_CONNECTION_FLOW, useValue: flow === 'click' ? FClickConnectFlow : flow }],
  };
}
