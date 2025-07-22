import { IPoint } from '@foblex/2d';
import { IConnectorAndRect } from '../i-connector-and-rect';

export class FindConnectableConnectorUsingPriorityAndPositionRequest {
  static readonly fToken = Symbol('FindConnectableConnectorUsingPriorityAndPositionRequest');
  constructor(
    public pointerPosition: IPoint,
    public connectableConnectors: IConnectorAndRect[],
  ) {
  }
}
