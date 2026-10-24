import { FConnectorBase } from '../../../f-connectors';

export class RemoveConnectorFromStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RemoveConnectorFromStoreRequest');
  constructor(public readonly instance: FConnectorBase) {}
}
