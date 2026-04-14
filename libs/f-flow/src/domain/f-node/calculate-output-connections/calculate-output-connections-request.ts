import { FNodeBase } from '../../../f-node';

export class CalculateOutputConnectionsRequest {
  static readonly fToken = Symbol('CalculateOutputConnectionsRequest');
  constructor(public readonly nodeOrGroup: FNodeBase) {}
}
