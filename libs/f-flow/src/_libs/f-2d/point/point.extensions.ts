import { IPoint } from './i-point';

export type PointInput = IPoint | null | undefined;

export class PointExtensions {
  public static castToPoint(value: PointInput): IPoint {
    return value || PointExtensions.initialize();
  }

  public static initialize(x: number = 0, y: number = 0): IPoint {
    return { x, y };
  }

  public static copy(point: IPoint): IPoint {
    return PointExtensions.initialize(point.x, point.y);
  }

  public static isEqual(point1: IPoint, point2: IPoint): boolean {
    return point1.x === point2.x && point1.y === point2.y;
  }

  public static sum(point1: IPoint, point2: IPoint): IPoint {
    return { x: point1.x + point2.x, y: point1.y + point2.y };
  }

  public static sub(point1: IPoint, point2: IPoint): IPoint {
    return { x: point1.x - point2.x, y: point1.y - point2.y };
  }

  public static div(point: IPoint, value: number): IPoint {
    return { x: point.x / value, y: point.y / value };
  }

  public static mult(point: IPoint, value: number): IPoint {
    return { x: point.x * value, y: point.y * value };
  }

  public static interpolatePoints(point1: IPoint, point2: IPoint, t: number): IPoint {
    const oneMinusT = 1.0 - t;

    return PointExtensions.initialize(
      point1.x * oneMinusT + point2.x * t,
      point1.y * oneMinusT + point2.y * t,
    );
  }

  public static roundTo(point: IPoint, size: number): IPoint {
    const xCount = Math.trunc(point.x / size);
    const yCount = Math.trunc(point.y / size);

    return { x: xCount * size, y: yCount * size };
  }

  public static hypotenuse(point1: IPoint, point2: IPoint): number {
    const a = point2.x - point1.x;
    const b = point2.y - point1.y;

    return Math.abs(Math.sqrt(a * a + b * b));
  }

  public static distance(point1: IPoint, point2: IPoint): number {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  public static getMinimum(point1: IPoint, point2: IPoint): IPoint {
    return PointExtensions.initialize(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
  }

  public static getMaximum(point1: IPoint, point2: IPoint): IPoint {
    return PointExtensions.initialize(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));
  }

  public static matrixTransform(point: IPoint, element: SVGSVGElement): IPoint {
    let result: IPoint = PointExtensions.initialize(point.x, point.y);

    const matrix = element.getScreenCTM();
    if (matrix) {
      const svgPoint = element.createSVGPoint();
      svgPoint.x = point.x;
      svgPoint.y = point.y;
      result = svgPoint.matrixTransform(matrix.inverse());
    }

    return result;
  }

  public static elementTransform(point: IPoint, element: HTMLElement | SVGElement): IPoint {
    let result: IPoint = PointExtensions.initialize(point.x, point.y);

    const matrix = element.getBoundingClientRect();

    result = PointExtensions.sub(result, PointExtensions.initialize(matrix.left, matrix.top));

    return result;
  }
}
