import { FNodeBase } from '../../../f-node';

export class CalculateConnectorsConnectableSidesRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('CalculateConnectorsConnectableSidesRequest');
  constructor(public readonly nodeOrGroup: FNodeBase) {}
}
