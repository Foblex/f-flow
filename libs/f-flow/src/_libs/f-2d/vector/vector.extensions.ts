import { IVector } from './i-vector';
import { IPoint, PointExtensions } from '../point';

export class VectorExtensions {
  public static initialize(x: number = 0, y: number = 0): IVector {
    return PointExtensions.initialize(x, y);
  }

  public static fromPoints(p1: IPoint, p2: IPoint): IVector {
    return VectorExtensions.initialize(p2.x - p1.x, p2.y - p1.y);
  }

  public static vectorLength(v: IVector): number {
    return Math.sqrt(VectorExtensions.magnitudeSquared(v));
  }

  public static magnitudeSquared(v: IVector): number {
    return v.x * v.x + v.y * v.y;
  }

  public static dotProduct(v1: IVector, v2: IVector): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  public static crossProduct(v1: IVector, v2: IVector): number {
    return v1.x * v2.y - v1.y * v2.x;
  }

  public static subtract(v1: IVector, v2: IVector): IVector {
    return VectorExtensions.initialize(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * @deprecated Not used by `@foblex/flow`; removed from the public API in v20. Depend on
   * `@foblex/2d` directly if you still need it.
   */
  public static add(v1: IVector, v2: IVector): IVector {
    return VectorExtensions.initialize(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * @deprecated Not used by `@foblex/flow`; removed from the public API in v20. Depend on
   * `@foblex/2d` directly if you still need it.
   */
  public static scale(v: IVector, value: number): IVector {
    return VectorExtensions.initialize(v.x * value, v.y * value);
  }

  public static angle(v1: IVector, v2: IVector): number {
    const radians = Math.acos(
      Math.max(
        -1,
        Math.min(
          VectorExtensions.dotProduct(v1, v2) /
            (VectorExtensions.vectorLength(v1) * VectorExtensions.vectorLength(v2)),
          1,
        ),
      ),
    );

    return VectorExtensions.crossProduct(v1, v2) < 0.0 ? -radians : radians;
  }
}
