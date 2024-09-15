import { IPoint, IRect } from '@foblex/2d';
import { FMinimapData } from '../f-minimap-data';

export class CalculateFlowPointFromMinimapPointRequest {

  constructor(
    public flowRect: IRect,
    public canvasPosition: IPoint,
    public eventPoint: IPoint,
    public minimap: FMinimapData
  ) {
  }
}
