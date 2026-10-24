import { FSourceConnectorBase } from '../../../f-connectors';
import { IPoint } from '../../../_libs/f-2d';
import type { IConnectorRectRef } from '../i-connector-rect-ref';

export class CalculateTargetConnectorsToConnectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IConnectorRectRef[];

  static readonly fToken = Symbol('CalculateTargetConnectorsToConnectRequest');
  constructor(
    public readonly source: FSourceConnectorBase,
    public readonly pointer: IPoint,
  ) {}
}
