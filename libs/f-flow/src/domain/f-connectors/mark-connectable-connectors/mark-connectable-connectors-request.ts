import { FConnectorBase } from '../../../f-connectors';

export class MarkConnectableConnectorsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('MarkConnectableConnectorsRequest');

  constructor(public readonly connectors: FConnectorBase[]) {}
}
