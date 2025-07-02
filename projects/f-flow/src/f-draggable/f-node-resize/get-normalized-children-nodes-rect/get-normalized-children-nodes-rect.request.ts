import { FNodeBase } from '../../../f-node';

export class GetNormalizedChildrenNodesRectRequest {
  static readonly fToken = Symbol('GetNormalizedChildrenNodesRectRequest');

  constructor(
    public fNode: FNodeBase,
    public paddings: [ number, number, number, number ]
  ) {
  }
}
