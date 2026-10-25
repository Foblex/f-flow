import { IPoint, IRect } from '../../../_libs/f-2d';
import { FMinimapState } from '../../../domain';

export class CalculateFlowPointFromMinimapPointRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IPoint;

  static readonly fToken = Symbol('CalculateFlowPointFromMinimapPointRequest');

  constructor(
    public readonly flowRect: IRect,
    public readonly canvasPosition: IPoint,
    public readonly eventPoint: IPoint,
    public readonly minimap: FMinimapState,
  ) {}
}
