import { IPoint, IRoundedRect } from '@foblex/2d';
import { IConnectorAndRect } from '../i-connector-and-rect';

export class FindInputAtPositionRequest {
  static readonly fToken = Symbol('FindInputAtPositionRequest');
  constructor(
    public pointerPosition: IPoint,
    public toConnectorRect: IRoundedRect,
    public canBeConnectedInputs: IConnectorAndRect[],
  ) {
  }
}
