import { FNodeBase } from '../../../f-node';
import type { IRect } from '../../../_libs/f-2d';

export class CalculateNodesBoundingBoxNormalizedPositionRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IRect | null;

  static readonly fToken = Symbol('CalculateNodesBoundingBoxNormalizedPositionRequest');
  constructor(public fNodes?: FNodeBase[]) {}
}
