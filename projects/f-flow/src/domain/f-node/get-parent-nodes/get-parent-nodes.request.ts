import { FNodeBase } from '../../../f-node';

export class GetParentNodesRequest {
  static readonly fToken = Symbol('GetParentNodesRequest');
  constructor(
    public fNode: FNodeBase,
  ) {
  }
}
