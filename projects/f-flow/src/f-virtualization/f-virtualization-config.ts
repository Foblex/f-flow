import { InjectionToken } from '@angular/core';

export interface IFVirtualizationConfig {
  /** Enable/disable virtualization. Default: false (opt-in). */
  enabled: boolean;
  /** Default estimated node size (width, height) when measured size is unknown. */
  estimatedSize: { width: number; height: number };
  /** Extra buffer in pixels beyond the viewport for rendering nodes. */
  bufferPx: number;
  /** Max nodes to measure per animation frame. */
  measureBatchSize: number;
  /** Apply CSS containment on node hosts for additional performance. */
  enableContainmentCSS: boolean;
}

export const F_VIRTUALIZATION_DEFAULT_CONFIG: IFVirtualizationConfig = {
  enabled: false,
  estimatedSize: { width: 200, height: 100 },
  bufferPx: 200,
  measureBatchSize: 50,
  enableContainmentCSS: false,
};

export const F_VIRTUALIZATION_CONFIG = new InjectionToken<IFVirtualizationConfig>(
  'F_VIRTUALIZATION_CONFIG',
);
