import { FNodeBase } from '../../../f-node';

export class GetNormalizedParentNodeRectRequest {
  static readonly fToken = Symbol('GetNormalizedParentNodeRectRequest');

  constructor(
    public fNode: FNodeBase
  ) {
  }
}
