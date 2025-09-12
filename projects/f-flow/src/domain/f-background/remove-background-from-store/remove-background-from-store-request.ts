import { FBackgroundBase } from '../../../f-backgroud';

export class RemoveBackgroundFromStoreRequest {
  static readonly fToken = Symbol('RemoveBackgroundFromStoreRequest');
  constructor(
    public fConnection: FBackgroundBase,
  ) {
  }
}
