import { FConnectorBase } from '../../../f-connectors';

export class AddOutletToStoreRequest {
  static readonly fToken = Symbol('AddOutletToStoreRequest');
  constructor(
    public fComponent: FConnectorBase,
  ) {
  }
}
