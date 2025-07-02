import { FConnectionBase } from '../../../f-connection';

export class CreateConnectionMarkersRequest {
  static readonly fToken = Symbol('CreateConnectionMarkersRequest');

  constructor(
    public fConnection: FConnectionBase,
  ) {
  }
}
