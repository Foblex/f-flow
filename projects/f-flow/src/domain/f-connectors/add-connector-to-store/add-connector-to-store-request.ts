import { FConnectorBase } from '../../../f-connectors';

export class AddConnectorToStoreRequest {
  static readonly fToken = Symbol('AddConnectorToStoreRequest');
  constructor(public readonly instance: FConnectorBase) {}
}
