import { IPoint, IRect } from '@foblex/2d';
import { FMinimapState } from '../../../domain';

export class CalculateFlowPointFromMinimapPointRequest {
  static readonly fToken = Symbol('CalculateFlowPointFromMinimapPointRequest');

  constructor(
    public readonly flowRect: IRect,
    public readonly canvasPosition: IPoint,
    public readonly eventPoint: IPoint,
    public readonly minimap: FMinimapState,
  ) {}
}
