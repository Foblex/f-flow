import { FConnectorBase } from '../../../f-connectors';

export class UnmarkConnectableConnectorsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('UnmarkConnectableConnectorsRequest');

  constructor(public readonly connectors: FConnectorBase[]) {}
}
