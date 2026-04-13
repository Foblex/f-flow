import { FFlowBase } from '../../../f-flow';

export class AddFlowToStoreRequest {
  static readonly fToken = Symbol('AddFlowToStoreRequest');

  constructor(public readonly instance: FFlowBase) {}
}
