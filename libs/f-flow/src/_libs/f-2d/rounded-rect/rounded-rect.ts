import { IRoundedRect } from './i-rounded-rect';
import { IPoint, Point, PointExtensions } from '../point';
import { IRect } from '../rect';

export class RoundedRect implements IRoundedRect {
  public gravityCenter: IPoint = PointExtensions.initialize();

  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 0,
    public height: number = 0,
    public radius1: number = 0,
    public radius2: number = 0,
    public radius3: number = 0,
    public radius4: number = 0,
  ) {
    this.gravityCenter = this._calculateGravityCenter(this);
  }

  private _calculateGravityCenter(rect: IRoundedRect): IPoint {
    return new Point(rect.x + rect.width / 2, rect.y + rect.height / 2);
  }

  public static fromRect(rect: IRect): RoundedRect {
    return new RoundedRect(rect.x, rect.y, rect.width, rect.height);
  }

  public static fromRoundedRect(rect: IRoundedRect): RoundedRect {
    return new RoundedRect(
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      rect.radius1,
      rect.radius2,
      rect.radius3,
      rect.radius4,
    );
  }

  public static fromCenter(rect: IRoundedRect, width: number, height: number): RoundedRect {
    return new RoundedRect(
      rect.gravityCenter.x - width / 2,
      rect.gravityCenter.y - height / 2,
      width,
      height,
      rect.radius1,
      rect.radius2,
      rect.radius3,
      rect.radius4,
    );
  }

  /**
   * @deprecated Not used by `@foblex/flow`; removed from the public API in v20. Depend on
   * `@foblex/2d` directly if you still need it.
   */
  public static fromPoint(point: IPoint): RoundedRect {
    return new RoundedRect(point.x, point.y);
  }

  public addPoint(point: IPoint): RoundedRect {
    const copy = RoundedRect.fromRoundedRect(this);
    copy.x += point.x;
    copy.y += point.y;
    copy.gravityCenter = this._calculateGravityCenter(copy);

    return copy;
  }
}
