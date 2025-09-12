import { FConnectorBase } from '../../../f-connectors';

export class RemoveOutletFromStoreRequest {
  static readonly fToken = Symbol('RemoveOutletFromStoreRequest');
  constructor(
    public fComponent: FConnectorBase,
  ) {
  }
}
