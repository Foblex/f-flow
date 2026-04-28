import { Provider } from '@angular/core';

/**
 * Discriminator for `with*()` features composed by `provideFFlow`.
 */
export enum EFFlowFeatureKind {
  REFLOW_ON_RESIZE = 'reflow-on-resize',
}

/**
 * Feature envelope returned by `with*()` helpers.
 *
 * Each helper returns a kind tag and the provider list that activates the feature.
 * `provideFFlow` flattens these into a single `Provider[]` placed in the host's
 * `providers` array.
 */
export interface IFFlowFeature<K extends EFFlowFeatureKind = EFFlowFeatureKind> {
  readonly kind: K;
  readonly providers: Provider[];
}
