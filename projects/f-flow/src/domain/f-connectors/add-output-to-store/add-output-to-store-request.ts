import { FConnectorBase } from '../../../f-connectors';

export class AddOutputToStoreRequest {
  static readonly fToken = Symbol('AddOutputToStoreRequest');
  constructor(public readonly component: FConnectorBase) {}
}
