import { FConnectionBase } from '../../../f-connection';

export class AddConnectionToStoreRequest {
  static readonly fToken = Symbol('AddConnectionToStoreRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
