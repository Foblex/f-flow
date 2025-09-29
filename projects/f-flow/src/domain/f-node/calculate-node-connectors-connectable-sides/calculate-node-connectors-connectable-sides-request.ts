import { FNodeBase } from '../../../f-node';

export class CalculateNodeConnectorsConnectableSidesRequest {
  static readonly fToken = Symbol('CalculateNodeConnectorsConnectableSidesRequest');
  constructor(public readonly node: FNodeBase) {}
}
