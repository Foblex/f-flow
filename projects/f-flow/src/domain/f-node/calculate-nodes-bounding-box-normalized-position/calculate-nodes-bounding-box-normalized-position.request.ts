import { FNodeBase } from '../../../f-node';

export class CalculateNodesBoundingBoxNormalizedPositionRequest {
  static readonly fToken = Symbol('CalculateNodesBoundingBoxNormalizedPositionRequest');
  constructor(
    public fNodes?: FNodeBase[],
  ) {
  }
}
