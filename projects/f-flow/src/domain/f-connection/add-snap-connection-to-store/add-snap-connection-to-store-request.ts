import { FConnectionBase } from '../../../f-connection-v2';

export class AddSnapConnectionToStoreRequest {
  static readonly fToken = Symbol('AddSnapConnectionToStoreRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
