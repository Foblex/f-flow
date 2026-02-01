import { IPoint } from '@foblex/2d';
import { IDeltaClampResult } from './delta-clamp';

export interface IDragNodeDeltaConstraintsResult {
  /** Delta after snap + hard clamp */
  hardDelta: IPoint;

  /** Per-soft-constraint overflow based on hardDelta */
  soft: IDeltaClampResult[];
}
