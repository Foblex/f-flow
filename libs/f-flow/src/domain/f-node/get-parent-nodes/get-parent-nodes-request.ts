import { FNodeBase } from '../../../f-node';

export class GetParentNodesRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: FNodeBase[];

  static readonly fToken = Symbol('GetParentNodesRequest');
  constructor(public readonly nodeOrGroup: FNodeBase) {}
}
