import { FConnectionBase } from '../../../f-connection-v2';

export class AddConnectionForCreateToStoreRequest {
  static readonly fToken = Symbol('AddConnectionForCreateToStoreRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
