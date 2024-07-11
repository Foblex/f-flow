import { IConnectorShape } from './i-connector-shape';
import { IRoundedRect } from './rounded-rect';
import { Arc, Line } from '@foblex/core';
import { EFConnectorShape } from './e-f-connector-shape';

export class FConnectorShapeExtensions {

  public static getSegments(shape: IConnectorShape): (Arc | Line)[] {
    let result: (Arc | Line)[] = [];
    switch (shape.type) {
      case EFConnectorShape.ROUNDED_RECT:
        result = this.parseRect(shape as IRoundedRect);
        break;
      default:
        throw new Error(`Unknown connector shape type: ${ shape.type }`);
    }
    return result;
  }

  /**
   * Parses the rounded rectangle into its constituent segments (arcs and lines).
   * @param rect - The rounded rectangle to parse.
   * @returns An array of arcs and lines representing the rectangle.
   */
  private static parseRect(rect: IRoundedRect): (Arc | Line)[] {
    const degree90 = Math.PI * 0.5;

    const x0 = rect.x;
    const y0 = rect.y;
    const x1 = rect.x + rect.width;
    const y1 = rect.y + rect.height;

    const topLeftX = rect.x + rect.radius1;
    const topLeftY = rect.y + rect.radius1;
    const topRightX = rect.x + rect.width - rect.radius2;
    const topRightY = rect.y + rect.radius2;
    const bottomRightX = rect.x + rect.width - rect.radius3;
    const bottomRightY = rect.y + rect.height - rect.radius3;
    const bottomLeftX = rect.x + rect.radius4;
    const bottomLeftY = rect.y + rect.height - rect.radius4;

    return [
      new Arc({ x: topLeftX, y: topLeftY }, rect.radius1, rect.radius1, 2 * degree90, 3 * degree90),
      new Line({ x: topLeftX, y: y0 }, { x: topRightX, y: y0 }),
      new Arc({ x: topRightX, y: topRightY }, rect.radius2, rect.radius2, 3 * degree90, 4 * degree90),
      new Line({ x: x1, y: topRightY }, { x: x1, y: bottomRightY }),
      new Arc({ x: bottomRightX, y: bottomRightY }, rect.radius3, rect.radius3, 0, degree90),
      new Line({ x: bottomRightX, y: y1 }, { x: bottomLeftX, y: y1 }),
      new Arc({ x: bottomLeftX, y: bottomLeftY }, rect.radius4, rect.radius4, degree90, 2 * degree90),
      new Line({ x: x0, y: bottomLeftY }, { x: x0, y: topLeftY }),
    ];
  }
}
