import {IMinMaxPoint, IPoint} from '@foblex/2d';

export interface ILimitEdges {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export interface ILimitResult {
  value: IPoint;
  overflow: IPoint;
  edges: ILimitEdges;
}

export class LimitBounds {

  constructor(
    private readonly _limit: IMinMaxPoint
  ) {
  }

  public limit(snappedDifference: IPoint): ILimitResult {
    const {min, max} = this._limit;

    const clampedX = this._clamp(snappedDifference.x, min.x, max.x);
    const clampedY = this._clamp(snappedDifference.y, min.y, max.y);

    const overflowX = snappedDifference.x - clampedX;
    const overflowY = snappedDifference.y - clampedY;

    const edges: ILimitEdges = {
      left: overflowX < 0,
      right: overflowX > 0,
      top: overflowY < 0,
      bottom: overflowY > 0,
    };

    return {
      value: {x: clampedX, y: clampedY},
      overflow: {x: overflowX, y: overflowY},
      edges
    };
  }

  private _clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

