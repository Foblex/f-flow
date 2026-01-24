import { FConnectionBase } from '../../../f-connection-v2';

export class RemoveConnectionFromStoreRequest {
  static readonly fToken = Symbol('RemoveConnectionFromStoreRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
