import { Provider } from '@angular/core';
import { F_FLOW_CONFIG, IFFlowConfig } from './i-f-flow-config';
import { IFFlowFeature } from './f-flow-feature';

/**
 * Entry point for the provider-based Flow configuration surface.
 *
 * Usage:
 * ```typescript
 * providers: [
 *   provideFFlow(
 *     { id: 'main' },                // optional flow-level config
 *     withReflowOnResize({ ... }),    // feature plugins
 *   ),
 * ];
 * ```
 *
 * The first positional argument is an optional `IFFlowConfig`. Any argument that
 * carries a `kind` discriminator is treated as a feature.
 */
export function provideFFlow(...features: IFFlowFeature[]): Provider[];
export function provideFFlow(config: IFFlowConfig, ...features: IFFlowFeature[]): Provider[];
export function provideFFlow(
  configOrFeature?: IFFlowConfig | IFFlowFeature,
  ...rest: IFFlowFeature[]
): Provider[] {
  const { config, features } = _normalizeArgs(configOrFeature, rest);

  const providers: Provider[] = [{ provide: F_FLOW_CONFIG, useValue: config }];

  for (const feature of features) {
    providers.push(...feature.providers);
  }

  return providers;
}

function _normalizeArgs(
  first: IFFlowConfig | IFFlowFeature | undefined,
  rest: IFFlowFeature[],
): { config: IFFlowConfig; features: IFFlowFeature[] } {
  if (first === undefined) {
    return { config: {}, features: rest };
  }

  if (_isFeature(first)) {
    return { config: {}, features: [first, ...rest] };
  }

  return { config: first, features: rest };
}

function _isFeature(value: IFFlowConfig | IFFlowFeature): value is IFFlowFeature {
  return typeof (value as IFFlowFeature).kind === 'string';
}
