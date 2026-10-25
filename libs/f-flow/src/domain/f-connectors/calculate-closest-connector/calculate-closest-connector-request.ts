import { IPoint } from '../../../_libs/f-2d';
import { IConnectorRectRef } from '../index';
import type { IClosestConnectorRef } from '../i-closest-connector-ref';

export class CalculateClosestConnectorRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IClosestConnectorRef | undefined;

  static readonly fToken = Symbol('CalculateClosestConnectorRequest');

  constructor(
    public readonly position: IPoint,
    public readonly connectorRefs: IConnectorRectRef[],
  ) {}
}
