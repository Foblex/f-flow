import { InjectionToken } from '@angular/core';
import {
  EFReflowAxis,
  EFReflowCollision,
  EFReflowDeltaSource,
  EFReflowMode,
  EFReflowScope,
} from './enums';

export interface IFReflowSpacingConfig {
  vertical?: number;
  horizontal?: number;
}

export interface IFReflowOnResizeConfig {
  enabled?: boolean;
  mode?: EFReflowMode;
  collision?: EFReflowCollision;
  scope?: EFReflowScope;
  axis?: EFReflowAxis;
  deltaSource?: EFReflowDeltaSource;
  spacing?: IFReflowSpacingConfig;
  maxCascadeDepth?: number;
  maxAbsoluteShiftPerPlan?: number;
}

/**
 * Fully resolved, non-optional configuration. Consumers inside the feature
 * read from this shape after `mergeReflowConfig` fills in defaults.
 */
export interface IFReflowOnResizeResolvedConfig {
  enabled: boolean;
  mode: EFReflowMode;
  collision: EFReflowCollision;
  scope: EFReflowScope;
  axis: EFReflowAxis;
  deltaSource: EFReflowDeltaSource;
  spacing: {
    vertical: number;
    horizontal: number;
  };
  maxCascadeDepth: number;
  maxAbsoluteShiftPerPlan: number;
}

export const F_REFLOW_CONFIG = new InjectionToken<IFReflowOnResizeResolvedConfig>(
  'F_REFLOW_CONFIG',
);

const DEFAULT_CONFIG: IFReflowOnResizeResolvedConfig = {
  enabled: true,
  mode: EFReflowMode.CENTER_OF_MASS,
  collision: EFReflowCollision.STOP,
  scope: EFReflowScope.GLOBAL,
  axis: EFReflowAxis.BOTH,
  deltaSource: EFReflowDeltaSource.EDGE_BASED,
  spacing: {
    vertical: 32,
    horizontal: 32,
  },
  maxCascadeDepth: 8,
  maxAbsoluteShiftPerPlan: 10000,
};

export function mergeReflowConfig(
  partial: IFReflowOnResizeConfig | undefined,
): IFReflowOnResizeResolvedConfig {
  if (!partial) {
    return {
      ...DEFAULT_CONFIG,
      spacing: { ...DEFAULT_CONFIG.spacing },
    };
  }

  return {
    enabled: partial.enabled ?? DEFAULT_CONFIG.enabled,
    mode: partial.mode ?? DEFAULT_CONFIG.mode,
    collision: partial.collision ?? DEFAULT_CONFIG.collision,
    scope: partial.scope ?? DEFAULT_CONFIG.scope,
    axis: partial.axis ?? DEFAULT_CONFIG.axis,
    deltaSource: partial.deltaSource ?? DEFAULT_CONFIG.deltaSource,
    spacing: {
      vertical: partial.spacing?.vertical ?? DEFAULT_CONFIG.spacing.vertical,
      horizontal: partial.spacing?.horizontal ?? DEFAULT_CONFIG.spacing.horizontal,
    },
    maxCascadeDepth: partial.maxCascadeDepth ?? DEFAULT_CONFIG.maxCascadeDepth,
    maxAbsoluteShiftPerPlan:
      partial.maxAbsoluteShiftPerPlan ?? DEFAULT_CONFIG.maxAbsoluteShiftPerPlan,
  };
}
