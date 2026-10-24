import { FFlowBase } from '../../../f-flow';

export class RemoveFlowFromStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RemoveFlowFromStoreRequest');

  constructor(public readonly instance: FFlowBase) {}
}
