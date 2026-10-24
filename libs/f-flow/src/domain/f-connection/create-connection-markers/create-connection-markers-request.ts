import { FConnectionBase } from '../../../f-connection-v2';

export class CreateConnectionMarkersRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: boolean;

  static readonly fToken = Symbol('CreateConnectionMarkersRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
