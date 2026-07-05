import { EFFlowFeatureKind, IFFlowFeature } from '../../provide-f-flow';
import { F_A11Y_CONFIG, IFA11yConfig, mergeA11yConfig } from './i-f-a11y';

/**
 * Configures the accessibility layer inside `provideFFlow(...)`.
 *
 * ```typescript
 * @Component({
 *   providers: [
 *     provideFFlow(
 *       withA11y({
 *         moveStep: 20,
 *         messages: { grabbed: (label) => `${label} взят. Стрелки — перемещение` },
 *       }),
 *     ),
 *   ],
 * })
 * export class MyFlow {}
 * ```
 *
 * Semantics (roles, names, live region) run in every flow without any setup; the
 * KEYBOARD layer is opt-in — installing this feature turns it on. Use the config to
 * localize the message catalog, tune the movement steps, rebind keys, or keep the
 * keyboard off with `{ keyboard: false }` while still customizing messages.
 *
 * Registering the feature twice replaces the earlier configuration via Angular's
 * last-wins provider semantics.
 */
export function withA11y(config?: IFA11yConfig): IFFlowFeature<EFFlowFeatureKind.A11Y> {
  return {
    kind: EFFlowFeatureKind.A11Y,
    providers: [{ provide: F_A11Y_CONFIG, useValue: mergeA11yConfig(config) }],
  };
}
