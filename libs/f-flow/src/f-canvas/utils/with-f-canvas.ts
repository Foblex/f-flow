import { EFFlowFeatureKind, IFFlowFeature } from '../../provide-f-flow';
import { F_CANVAS_CONFIG, MergeFCanvasConfig, mergeFCanvasConfig } from './index';

/**
 * Configures `<f-canvas>` inside `provideFFlow(...)`.
 *
 * ```typescript
 * @Component({
 *   providers: [
 *     provideFFlow(
 *       withFCanvas({ layers: [EFLayer.GROUPS, EFLayer.NODES, EFLayer.CONNECTIONS] }),
 *     ),
 *   ],
 * })
 * export class MyFlow {}
 * ```
 *
 * The order is read bottom to top — the first entry sits underneath,
 * the last entry sits on top. Missing layers are appended in their
 * default position.
 *
 * The same value can also be set per-instance via
 * `<f-canvas [fLayers]="...">`. The component input wins when both are
 * present, so `withFCanvas` acts as the app-wide default and individual
 * canvases can opt out without re-providing the feature.
 *
 * Registering the feature twice replaces the earlier config via
 * Angular's last-wins provider semantics.
 */
export function withFCanvas(config?: MergeFCanvasConfig): IFFlowFeature<EFFlowFeatureKind.CANVAS> {
  return {
    kind: EFFlowFeatureKind.CANVAS,
    providers: [{ provide: F_CANVAS_CONFIG, useValue: mergeFCanvasConfig(config) }],
  };
}
