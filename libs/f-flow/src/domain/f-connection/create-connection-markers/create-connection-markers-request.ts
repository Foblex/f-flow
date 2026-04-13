import { FConnectionBase } from '../../../f-connection-v2';

export class CreateConnectionMarkersRequest {
  static readonly fToken = Symbol('CreateConnectionMarkersRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
