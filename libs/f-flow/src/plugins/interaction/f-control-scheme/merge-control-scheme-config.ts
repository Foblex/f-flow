import { InjectionToken } from '@angular/core';
import { IFControlScheme, IFControlSchemeConfig } from './i-f-control-scheme';
import { F_DEFAULT_CONTROL_SCHEME } from './constants';

/**
 * Fully resolved control scheme installed by `withControlScheme(...)`. The token always
 * resolves to a complete {@link IFControlScheme} — the partial config is merged over
 * {@link F_DEFAULT_CONTROL_SCHEME} before binding, so downstream consumers never have to
 * handle `undefined` gestures.
 */
export const F_CONTROL_SCHEME_CONFIG = new InjectionToken<IFControlScheme>(
  'F_CONTROL_SCHEME_CONFIG',
);

export function mergeControlSchemeConfig(
  partial: IFControlSchemeConfig | undefined,
): IFControlScheme {
  return { ...F_DEFAULT_CONTROL_SCHEME, ...partial };
}
