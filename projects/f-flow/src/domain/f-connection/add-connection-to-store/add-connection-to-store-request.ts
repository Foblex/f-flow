import { FConnectionBase } from '../../../f-connection';

export class AddConnectionToStoreRequest {
  static readonly fToken = Symbol('AddConnectionToStoreRequest');

  constructor(
    public fConnection: FConnectionBase,
  ) {
  }
}
