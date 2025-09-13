import { FConnectorBase } from '../../../f-connectors';

export class AddOutletToStoreRequest {
  static readonly fToken = Symbol('AddOutletToStoreRequest');
  constructor(public readonly component: FConnectorBase) {}
}
