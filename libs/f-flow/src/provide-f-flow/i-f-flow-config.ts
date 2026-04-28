import { InjectionToken } from '@angular/core';

/**
 * Flow-level configuration passed as the first argument to `provideFFlow(...)`.
 *
 * Priority for `id`: `[fFlowId]` input on `<f-flow>` > this config > auto-generated.
 */
export interface IFFlowConfig {
  id?: string;
}

export const F_FLOW_CONFIG = new InjectionToken<IFFlowConfig>('F_FLOW_CONFIG');
