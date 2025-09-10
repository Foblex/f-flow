import { FConnectorBase } from '../../../f-connectors';

export class RemoveOutputFromStoreRequest {
  static readonly fToken = Symbol('RemoveOutputFromStoreRequest');
  constructor(
    public fComponent: FConnectorBase,
  ) {
  }
}
