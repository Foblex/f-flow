import { FConnectionBase } from '../../../f-connection';

export class AddConnectionForCreateToStoreRequest {
  static readonly fToken = Symbol('AddConnectionForCreateToStoreRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
