import { FFlowBase } from '../../../f-flow';

export class RemoveFlowFromStoreRequest {
  static readonly fToken = Symbol('RemoveFlowFromStoreRequest');

  constructor(public readonly instance: FFlowBase) {}
}
