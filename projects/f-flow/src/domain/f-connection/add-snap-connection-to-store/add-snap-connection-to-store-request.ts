import { FConnectionBase } from '../../../f-connection';

export class AddSnapConnectionToStoreRequest {
  static readonly fToken = Symbol('AddSnapConnectionToStoreRequest');

  constructor(
    public fConnection: FConnectionBase,
  ) {
  }
}
