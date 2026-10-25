import { FConnectionBase } from '../../../f-connection-v2';

export class AddConnectionToStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AddConnectionToStoreRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
