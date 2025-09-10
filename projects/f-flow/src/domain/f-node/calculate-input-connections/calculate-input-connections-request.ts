import { FNodeBase } from '../../../f-node';

export class CalculateInputConnectionsRequest {
  static readonly fToken = Symbol('CalculateInputConnectionsRequest');
  constructor(
    public fNode: FNodeBase,
  ) {
  }
}
