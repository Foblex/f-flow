import { FNodeBase } from '../../../f-node';

export class GetNormalizedChildrenNodesRectRequest {

  constructor(
    public fNode: FNodeBase,
    public paddings: [ number, number, number, number ]
  ) {
  }
}
