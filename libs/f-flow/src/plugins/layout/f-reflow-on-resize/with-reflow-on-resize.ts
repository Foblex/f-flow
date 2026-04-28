import { EFFlowFeatureKind, IFFlowFeature } from '../../../provide-f-flow';
import { FReflowController } from './f-reflow-controller';
import {
  F_REFLOW_CONFIG,
  IFReflowOnResizeConfig,
  mergeReflowConfig,
} from './i-f-reflow-on-resize-config';

/**
 * Activates the reflow-on-resize feature inside `provideFFlow(...)`.
 *
 * ```typescript
 * @Component({
 *   providers: [
 *     provideFFlow(
 *       withReflowOnResize({ mode: EFReflowMode.CENTER_OF_MASS }),
 *     ),
 *   ],
 * })
 * export class MyFlow {
 *   private readonly _reflow = inject(FReflowController);
 *   // ...
 * }
 * ```
 *
 * Installs `F_REFLOW_CONFIG` and `FReflowController` at the host
 * component's injector — both are reachable from the same component
 * that calls `provideFFlow(...)`. The downstream services
 * (`FReflowOrchestrator`, `FReflowPlanner`, `FReflowIgnoreRegistry`,
 * `FReflowBaselineTracker`) are provided unconditionally by `<f-flow>`
 * and find the controller via the parent injector chain.
 *
 * Registering the feature twice replaces the earlier config via Angular's
 * last-wins provider semantics.
 */
export function withReflowOnResize(
  config?: IFReflowOnResizeConfig,
): IFFlowFeature<EFFlowFeatureKind.REFLOW_ON_RESIZE> {
  return {
    kind: EFFlowFeatureKind.REFLOW_ON_RESIZE,
    providers: [
      { provide: F_REFLOW_CONFIG, useValue: mergeReflowConfig(config) },
      FReflowController,
    ],
  };
}
