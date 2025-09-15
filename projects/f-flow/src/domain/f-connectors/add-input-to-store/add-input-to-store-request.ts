import { FConnectorBase } from '../../../f-connectors';

export class AddInputToStoreRequest {
  static readonly fToken = Symbol('AddInputToStoreRequest');
  constructor(public readonly component: FConnectorBase) {}
}
