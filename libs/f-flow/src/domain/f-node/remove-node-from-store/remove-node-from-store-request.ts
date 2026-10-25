import { FNodeBase } from '../../../f-node';

export class RemoveNodeFromStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RemoveNodeFromStoreRequest');
  constructor(public readonly instance: FNodeBase) {}
}
