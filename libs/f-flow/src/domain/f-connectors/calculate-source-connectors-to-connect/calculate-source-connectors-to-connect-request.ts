import { FConnectorBase } from '../../../f-connectors';
import { IPoint } from '@foblex/2d';
import type { IConnectorRectRef } from '../i-connector-rect-ref';

export class CalculateSourceConnectorsToConnectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IConnectorRectRef[];

  static readonly fToken = Symbol('CalculateSourceConnectorsToConnectRequest');

  constructor(
    public readonly target: FConnectorBase,
    public readonly pointer: IPoint,
  ) {}
}
