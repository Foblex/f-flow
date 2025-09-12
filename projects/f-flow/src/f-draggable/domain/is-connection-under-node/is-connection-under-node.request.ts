import { FNodeBase } from '../../../f-node';

export class IsConnectionUnderNodeRequest {
  static readonly fToken = Symbol('IsConnectionUnderNodeRequest');
  constructor(
    public fNode: FNodeBase,
  ) {
  }
}
