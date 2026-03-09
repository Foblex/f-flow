import { FConnectorBase } from '../../../f-connectors';
import { FConnectionBase } from '../../../f-connection-v2';

export interface IFConnectionWorkerConnectors {
  source: FConnectorBase;
  target: FConnectorBase;
}

export class ResolveConnectionWorkerConnectorsRequest {
  static readonly fToken = Symbol('ResolveConnectionWorkerConnectorsRequest');

  constructor(public readonly connection: FConnectionBase) {}
}
