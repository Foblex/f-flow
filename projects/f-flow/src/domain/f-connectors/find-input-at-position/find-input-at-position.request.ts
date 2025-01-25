import { IPoint, IRoundedRect } from '@foblex/2d';
import { IConnectorAndRect } from '../i-connector-and-rect';

export class FindInputAtPositionRequest {

  constructor(
    public pointerPosition: IPoint,
    public toConnectorRect: IRoundedRect,
    public canBeConnectedInputs: IConnectorAndRect[],
  ) {
  }
}
