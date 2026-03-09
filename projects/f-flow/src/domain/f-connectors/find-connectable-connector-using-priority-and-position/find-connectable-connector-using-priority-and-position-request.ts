import { IPoint } from '@foblex/2d';
import { IConnectorRectRef } from '../i-connector-rect-ref';

export class FindConnectableConnectorUsingPriorityAndPositionRequest {
  static readonly fToken = Symbol('FindConnectableConnectorUsingPriorityAndPositionRequest');
  constructor(
    public pointerPosition: IPoint,
    public connectableConnectors: IConnectorRectRef[],
  ) {}
}
