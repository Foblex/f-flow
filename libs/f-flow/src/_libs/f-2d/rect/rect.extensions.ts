import { IRect } from './i-rect';
import { IPoint, PointExtensions } from '../point';

export class RectExtensions {
  public static initialize(
    x: number = 0,
    y: number = 0,
    width: number = 0,
    height: number = 0,
  ): IRect {
    if (width < 0) {
      x = x + width;
      width = -width;
    }
    if (height < 0) {
      y = y + height;
      height = -height;
    }
    const gravityCenter = PointExtensions.initialize(x + width / 2, y + height / 2);

    return { x, y, width, height, gravityCenter };
  }

  public static copy(rect: IRect): IRect {
    return RectExtensions.initialize(rect.x, rect.y, rect.width, rect.height);
  }

  public static fromElement(element: HTMLElement | SVGElement): IRect {
    const { x, y, width, height } = element.getBoundingClientRect();

    return RectExtensions.initialize(x, y, width, height);
  }

  public static isIncludePoint(rect: IRect, point: IPoint): boolean {
    return (
      point.x >= RectExtensions.left(rect) &&
      point.x <= RectExtensions.right(rect) &&
      point.y >= RectExtensions.top(rect) &&
      point.y <= RectExtensions.bottom(rect)
    );
  }

  public static intersectionWithRect(rect1: IRect, rect2: IRect): boolean {
    return !(
      rect1.x + rect1.width < rect2.x ||
      rect2.x + rect2.width < rect1.x ||
      rect1.y + rect1.height < rect2.y ||
      rect2.y + rect2.height < rect1.y
    );
  }

  public static left(rect: IRect): number {
    return rect.x;
  }

  public static top(rect: IRect): number {
    return rect.y;
  }

  public static right(rect: IRect): number {
    return rect.x + rect.width;
  }

  public static bottom(rect: IRect): number {
    return rect.y + rect.height;
  }

  public static addPoint(rect: IRect, point: IPoint): IRect {
    const rectCopy = RectExtensions.copy(rect);
    rectCopy.x += point.x;
    rectCopy.y += point.y;

    return this.initialize(rectCopy.x, rectCopy.y, rectCopy.width, rectCopy.height);
  }

  public static mult(rect: IRect, value: number): IRect {
    const rectCopy = RectExtensions.copy(rect);
    rectCopy.x *= value;
    rectCopy.y *= value;
    rectCopy.width *= value;
    rectCopy.height *= value;

    return this.initialize(rectCopy.x, rectCopy.y, rectCopy.width, rectCopy.height);
  }

  public static div(rect: IRect, value: number): IRect {
    const rectCopy = RectExtensions.copy(rect);
    rectCopy.x /= value;
    rectCopy.y /= value;
    rectCopy.width /= value;
    rectCopy.height /= value;

    return this.initialize(rectCopy.x, rectCopy.y, rectCopy.width, rectCopy.height);
  }

  public static addPointToSize(rect: IRect, point: IPoint): IRect {
    const rectCopy = RectExtensions.copy(rect);
    rectCopy.width += point.x;
    rectCopy.height += point.y;

    return this.initialize(rectCopy.x, rectCopy.y, rectCopy.width, rectCopy.height);
  }

  public static union(rects: IRect[]): IRect | null {
    if (!rects || rects.length === 0) {
      return null;
    }

    return rects.reduce((result: IRect, rect) => {
      const minX = Math.min(result.x, rect.x);
      const minY = Math.min(result.y, rect.y);
      const maxX = Math.max(result.x + result.width, rect.x + rect.width);
      const maxY = Math.max(result.y + result.height, rect.y + rect.height);

      return RectExtensions.initialize(minX, minY, maxX - minX, maxY - minY);
    }, rects[0]);
  }

  public static elementTransform(rect: IRect, element: HTMLElement | SVGElement): IRect {
    const matrix = element.getBoundingClientRect();
    const position = PointExtensions.sub(rect, PointExtensions.initialize(matrix.left, matrix.top));

    return RectExtensions.initialize(position.x, position.y, rect.width, rect.height);
  }

  public static updateIsNotFinite(rect: IRect): IRect {
    if (
      !Number.isFinite(rect.width) ||
      !Number.isFinite(rect.height) ||
      !Number.isFinite(rect.x) ||
      !Number.isFinite(rect.y)
    ) {
      return RectExtensions.initialize(0, 0, 0, 0);
    }

    return rect;
  }
}
