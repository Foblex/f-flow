import { IRoundedRect } from './i-rounded-rect';
import { IPoint, IRect, Point } from '@foblex/core';
import { EFConnectorShape } from '../e-f-connector-shape';

export class RoundedRect implements IRoundedRect {

  public readonly type: EFConnectorShape = EFConnectorShape.ROUNDED_RECT;

  public gravityCenter: IPoint = { x: 0, y: 0 };

  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 0,
    public height: number = 0,
    public radius1: number = 0,
    public radius2: number = 0,
    public radius3: number = 0,
    public radius4: number = 0
  ) {
    this.gravityCenter = this.calculateGravityCenter(this);
  }

  private calculateGravityCenter(rect: IRoundedRect): IPoint {
    return new Point(rect.x + rect.width / 2, rect.y + rect.height / 2);
  }

  public static fromRect(rect: IRect): RoundedRect {
    return new RoundedRect(rect.x, rect.y, rect.width, rect.height);
  }

  public static fromRoundedRect(rect: IRoundedRect): RoundedRect {
    return new RoundedRect(rect.x, rect.y, rect.width, rect.height, rect.radius1, rect.radius2, rect.radius3, rect.radius4);
  }

  public static fromElement(element: HTMLElement | SVGElement): RoundedRect {
    const { x, y, width, height } = element.getBoundingClientRect();
    return this.setRadiusFromElement(new RoundedRect(x, y, width, height), element);
  }

  private static setRadiusFromElement(rect: RoundedRect, element: HTMLElement | SVGElement): RoundedRect {
    rect.radius1 = parseFloat(element.style.borderTopLeftRadius) || 0;
    rect.radius2 = parseFloat(element.style.borderTopRightRadius) || 0;
    rect.radius3 = parseFloat(element.style.borderBottomRightRadius) || 0;
    rect.radius4 = parseFloat(element.style.borderBottomLeftRadius) || 0;
    return rect;
  }

  public addPoint(point: IPoint): RoundedRect {
    const copy = RoundedRect.fromRoundedRect(this);
    copy.x += point.x;
    copy.y += point.y;
    copy.gravityCenter = this.calculateGravityCenter(copy);
    return copy;
  }
}
