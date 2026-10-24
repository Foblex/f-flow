import { IPoint } from '@foblex/2d';
import { IConnectorRectRef } from '../i-connector-rect-ref';
import type { FConnectorBase } from '../../../f-connectors';

export class FindConnectableConnectorUsingPriorityAndPositionRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: FConnectorBase | undefined;

  static readonly fToken = Symbol('FindConnectableConnectorUsingPriorityAndPositionRequest');
  constructor(
    public pointerPosition: IPoint,
    public connectableConnectors: IConnectorRectRef[],
  ) {}
}
