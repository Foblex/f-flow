import { FConnectionBase } from '../../../f-connection-v2';

export class AddConnectionToStoreRequest {
  static readonly fToken = Symbol('AddConnectionToStoreRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
