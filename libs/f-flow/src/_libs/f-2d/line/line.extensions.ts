import { IPoint, PointExtensions } from '../point';
import { ILine } from './i-line';

export class LineExtensions {
  public static initialize(
    point1: IPoint = PointExtensions.initialize(),
    point2: IPoint = PointExtensions.initialize(),
  ): ILine {
    return { point1, point2 };
  }

  /**
   * @deprecated Not used by `@foblex/flow`; removed from the public API in v20. Depend on
   * `@foblex/2d` directly if you still need it.
   */
  public static copy(line: ILine): ILine {
    return { point1: line.point1, point2: line.point2 };
  }

  /**
   * @deprecated Not used by `@foblex/flow`; removed from the public API in v20. Depend on
   * `@foblex/2d` directly if you still need it.
   */
  public static hypotenuse(line: ILine): number {
    return Math.sqrt((line.point1.x - line.point2.x) ** 2 + (line.point1.y - line.point2.y) ** 2);
  }
}
