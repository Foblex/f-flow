import { FConnectorBase } from '../../../f-connectors';

export class RemoveInputFromStoreRequest {
  static readonly fToken = Symbol('RemoveInputFromStoreRequest');
  constructor(public readonly component: FConnectorBase) {}
}
