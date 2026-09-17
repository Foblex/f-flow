import { InjectionToken } from '@angular/core';

/**
 * Configuration for the dev-mode `FFxxxx` diagnostics. All checks stay enabled by
 * default; use this block to tune or switch individual checks off.
 */
export interface IFFlowDiagnosticsConfig {
  /**
   * FF1010 threshold: warns when a rendered connectable connector's own box is
   * narrower or shorter than this many pixels — usually a connector whose visual
   * dot is drawn with `::before`/`::after` while the element itself has no size.
   * Set `0` to switch the check off. Default: `1`.
   */
  minConnectorSize?: number;
}

/**
 * Flow-level configuration passed as the first argument to `provideFFlow(...)`.
 *
 * Priority for `id`: `[fFlowId]` input on `<f-flow>` > this config > auto-generated.
 */
export interface IFFlowConfig {
  id?: string;

  diagnostics?: IFFlowDiagnosticsConfig;
}

export const F_FLOW_CONFIG = new InjectionToken<IFFlowConfig>('F_FLOW_CONFIG');
