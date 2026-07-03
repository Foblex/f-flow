import { EFFlowFeatureKind, IFFlowFeature } from '../../../provide-f-flow';
import { IFControlSchemeConfig } from './i-f-control-scheme';
import { F_CONTROL_SCHEME_CONFIG, mergeControlSchemeConfig } from './merge-control-scheme-config';
import { FControlSchemeController } from './f-control-scheme-controller';

/**
 * Installs a control scheme inside `provideFFlow(...)`.
 *
 * ```typescript
 * @Component({
 *   providers: [
 *     provideFFlow(withControlScheme(F_SCROLL_PAN_CONTROL_SCHEME)),
 *   ],
 * })
 * export class MyFlow {
 *   private readonly _controlScheme = inject(FControlSchemeController);
 *   // this._controlScheme.setScheme(F_DRAG_SELECT_CONTROL_SCHEME);
 * }
 * ```
 *
 * Pass a preset ({@link F_DEFAULT_CONTROL_SCHEME}, {@link F_SCROLL_PAN_CONTROL_SCHEME},
 * {@link F_DRAG_SELECT_CONTROL_SCHEME}) or a partial override — missing gestures fall
 * back to the default scheme. Without this feature the flow uses the default scheme.
 *
 * Registering the feature twice replaces the earlier scheme via Angular's last-wins
 * provider semantics.
 */
export function withControlScheme(
  scheme?: IFControlSchemeConfig,
): IFFlowFeature<EFFlowFeatureKind.CONTROL_SCHEME> {
  return {
    kind: EFFlowFeatureKind.CONTROL_SCHEME,
    providers: [
      { provide: F_CONTROL_SCHEME_CONFIG, useValue: mergeControlSchemeConfig(scheme) },
      FControlSchemeController,
    ],
  };
}
