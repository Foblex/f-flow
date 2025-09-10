import { FConnectionBase } from '../../../f-connection';

export class RemoveConnectionFromStoreRequest {
  static readonly fToken = Symbol('RemoveConnectionFromStoreRequest');

  constructor(
    public fConnection: FConnectionBase,
  ) {
  }
}
