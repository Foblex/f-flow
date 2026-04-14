import { IMinMaxPoint, IPoint } from '@foblex/2d';

export interface IConstraintEdges {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export interface IDeltaClampResult {
  value: IPoint; // clamped
  overflow: IPoint; // abs overflow after quantize
  edges: IConstraintEdges;
}

export class DeltaClamp {
  constructor(
    private readonly _limits: IMinMaxPoint,
    private readonly _quantizeStep: number = 0.5,
  ) {}

  public applyInto(offset: IPoint, out: IDeltaClampResult): void {
    const { min, max } = this._limits;

    const x = this._clamp(offset.x, min.x, max.x);
    const y = this._clamp(offset.y, min.y, max.y);

    const rawOverflowX = offset.x - x;
    const rawOverflowY = offset.y - y;

    const overflowX = this._quantizeSigned(rawOverflowX, this._quantizeStep);
    const overflowY = this._quantizeSigned(rawOverflowY, this._quantizeStep);

    out.value.x = x;
    out.value.y = y;

    out.edges.left = overflowX < 0;
    out.edges.right = overflowX > 0;
    out.edges.top = overflowY < 0;
    out.edges.bottom = overflowY > 0;

    out.overflow.x = Math.abs(overflowX);
    out.overflow.y = Math.abs(overflowY);
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
