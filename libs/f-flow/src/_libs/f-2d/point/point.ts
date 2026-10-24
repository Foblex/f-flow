import { IPoint } from './i-point';
import { PointExtensions } from './point.extensions';

export class Point implements IPoint {
  public x: number;

  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public static fromPoint(point: IPoint): Point {
    return new Point(point.x, point.y);
  }

  public add(point: IPoint): Point {
    const result = PointExtensions.sum(this, point);

    return Point.fromPoint(result);
  }

  public sub(point: IPoint): Point {
    const result = PointExtensions.sub(this, point);

    return Point.fromPoint(result);
  }

  public subNumber(value: number): Point {
    const result = PointExtensions.sub(this, new Point(value, value));

    return Point.fromPoint(result);
  }

  public div(value: number): Point {
    const result = PointExtensions.div(this, value);

    return Point.fromPoint(result);
  }

  public mult(value: number): Point {
    const result = PointExtensions.mult(this, value);

    return Point.fromPoint(result);
  }

  public matrixTransform(element: SVGSVGElement): Point {
    const result = PointExtensions.matrixTransform(this, element);

    return Point.fromPoint(result);
  }

  public elementTransform(element: HTMLElement | SVGElement): Point {
    const result = PointExtensions.elementTransform(this, element);

    return Point.fromPoint(result);
  }
}
