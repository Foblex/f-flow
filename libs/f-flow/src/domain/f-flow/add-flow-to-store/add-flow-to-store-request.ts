import { FFlowBase } from '../../../f-flow';

export class AddFlowToStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AddFlowToStoreRequest');

  constructor(public readonly instance: FFlowBase) {}
}
