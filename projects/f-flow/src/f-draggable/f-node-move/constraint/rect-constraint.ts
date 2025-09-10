import { IMinMaxPoint, IPoint } from "@foblex/2d";

export interface IConstraintEdges {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export interface IConstraintResult {
  value: IPoint;
  overflow: IPoint;
  edges: IConstraintEdges;
}

export class RectConstraint {
  constructor(
    private readonly _limits: IMinMaxPoint,
  ) {
  }

  public apply(offset: IPoint): IConstraintResult {
    const { min, max } = this._limits;

    const clampedX = this._clamp(offset.x, min.x, max.x);
    const clampedY = this._clamp(offset.y, min.y, max.y);

    const rawOverflowX = offset.x - clampedX;
    const rawOverflowY = offset.y - clampedY;

    const overflowX = this._quantizeSigned(rawOverflowX, 0.5);
    const overflowY = this._quantizeSigned(rawOverflowY, 0.5);

    const edges: IConstraintEdges = {
      left: overflowX < 0,
      right: overflowX > 0,
      top: overflowY < 0,
      bottom: overflowY > 0,
    };

    return {
      value: { x: clampedX, y: clampedY },
      overflow: { x: Math.abs(overflowX), y: Math.abs(overflowY) },
      edges,
    };
  }

  private _quantizeSigned(v: number, step: number): number {
    if (step <= 0 || v === 0) {
return 0;
}
    const k = v / step;

    return (v > 0 ? Math.ceil(k) : Math.floor(k)) * step;
  }

  private _clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
