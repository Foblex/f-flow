import { FConnectorBase } from '../../../f-connectors';

export class RemoveConnectorFromStoreRequest {
  static readonly fToken = Symbol('RemoveConnectorFromStoreRequest');
  constructor(public readonly instance: FConnectorBase) {}
}
