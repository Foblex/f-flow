import { FNodeBase } from '../../../f-node';

export class CalculateConnectorsConnectableSidesRequest {
  static readonly fToken = Symbol('CalculateConnectorsConnectableSidesRequest');
  constructor(public readonly node: FNodeBase) {}
}
