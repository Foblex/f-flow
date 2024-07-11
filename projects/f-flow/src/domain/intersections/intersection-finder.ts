import { Arc, IArc, IPoint, Line, PointExtensions, VectorExtensions } from '@foblex/core';
import { IConnectorShape } from './i-connector-shape';
import { FConnectorShapeExtensions } from './f-connector-shape.extensions';

/**
 * The IntersectionFinder class is designed to find intersection points between
 * line segments and various geometric shapes. Currently, it supports rectangles,
 * circles, and ellipses. In the future, support for additional shapes will be added.
 */
export class IntersectionFinder {

  /**
   * Finds the guaranteed intersection points between a line segment and a rounded rectangle.
   * @param from - Starting point of the line segment.
   * @param to - Ending point of the line segment.
   * @param shape - The shape to check for intersections.
   * @returns An array of intersection points.
   */
  public static getIntersections(from: IPoint, to: IPoint, shape: IConnectorShape): IPoint[] {
    const segments: (Arc | Line)[] = FConnectorShapeExtensions.getSegments(shape);

    for (const segment of segments) {
      if (segment instanceof Arc) {
        const intersections = this.intersectArcWithLine(segment, from, to);
        if (intersections.length > 0) {
          return intersections;
        }
      } else if (segment instanceof Line) {
        const intersection = this.intersectLineSegments(from, to, segment.point1, segment.point2);
        if (intersection) {
          return [ intersection ];
        }
      }
    }

    return [];
  }

  /**
   * Finds the intersection points between an arc and a line segment.
   * @param arc - The arc to check for intersections.
   * @param from - Starting point of the line segment.
   * @param to - Ending point of the line segment.
   * @returns An array of intersection points.
   */
  private static intersectArcWithLine(arc: IArc, from: IPoint, to: IPoint): IPoint[] {
    return this.filterPointsWithinArc(
      this.findEllipseLineIntersections(arc.center, arc.radiusX, arc.radiusY, from, to),
      arc
    );
  }

  /**
   * Finds the intersection point between two line segments.
   * @param p1 - Starting point of the first line segment.
   * @param p2 - Ending point of the first line segment.
   * @param p3 - Starting point of the second line segment.
   * @param p4 - Ending point of the second line segment.
   * @returns The intersection point or null if there is no intersection.
   */
  private static intersectLineSegments(p1: IPoint, p2: IPoint, p3: IPoint, p4: IPoint): IPoint | null {
    const s1_x = p2.x - p1.x;
    const s1_y = p2.y - p1.y;
    const s2_x = p4.x - p3.x;
    const s2_y = p4.y - p3.y;

    const s = (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = (s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return { x: p1.x + (t * s1_x), y: p1.y + (t * s1_y) };
    }

    return null;
  }

  /**
   * Filters intersection points to retain only those within the given arc.
   * @param points - The points to filter.
   * @param arc - The arc to check against.
   * @returns An array of points within the arc.
   */
  private static filterPointsWithinArc(points: IPoint[], arc: IArc): IPoint[] {
    let { center, startAngle, endAngle } = arc;

    if (points.length === 0) {
      return points;
    }

    if (endAngle < startAngle) {
      [ startAngle, endAngle ] = [ endAngle, startAngle ];
    }

    if (startAngle < 0 || endAngle < 0) {
      startAngle += 2.0 * Math.PI;
      endAngle += 2.0 * Math.PI;
    }

    const filteredPoints: IPoint[] = [];

    for (const point of points) {
      let angle = this.normalizeAngle(
        VectorExtensions.angle(
          VectorExtensions.initialize(1, 0),
          VectorExtensions.initialize(point.x - center.x, point.y - center.y)
        )
      );

      if (angle < startAngle) {
        angle += 2.0 * Math.PI;
      }

      if (startAngle <= angle && angle <= endAngle) {
        filteredPoints.push(point);
      }
    }

    return filteredPoints;
  }

  /**
   * Normalizes an angle to be within the range 0 to 2π.
   * @param radians - The angle in radians.
   * @returns The normalized angle.
   */
  private static normalizeAngle(radians: number): number {
    const normal = radians % (2.0 * Math.PI);
    return normal < 0.0 ? (normal + (2.0 * Math.PI)) : normal;
  }

  /**
   * Finds the intersection points between an ellipse and a line segment.
   * @param center - Center of the ellipse.
   * @param radiusX - X radius of the ellipse.
   * @param radiusY - Y radius of the ellipse.
   * @param pointA - Starting point of the line segment.
   * @param pointB - Ending point of the line segment.
   * @returns An array of intersection points.
   */
  private static findEllipseLineIntersections(center: IPoint, radiusX: number, radiusY: number, pointA: IPoint, pointB: IPoint): IPoint[] {
    const origin = VectorExtensions.initialize(pointA.x, pointA.y);
    const direction = VectorExtensions.fromPoints(pointA, pointB);
    const ellipseCenter = VectorExtensions.initialize(center.x, center.y);
    const diff = VectorExtensions.subtract(origin, ellipseCenter);
    const scaledDir = VectorExtensions.initialize(direction.x / (radiusX * radiusX), direction.y / (radiusY * radiusY));
    const scaledDiff = VectorExtensions.initialize(diff.x / (radiusX * radiusX), diff.y / (radiusY * radiusY));

    const a = VectorExtensions.dotProduct(direction, scaledDir);
    const b = VectorExtensions.dotProduct(direction, scaledDiff);
    const c = VectorExtensions.dotProduct(diff, scaledDiff) - 1.0;
    const discriminant = b * b - a * c;

    return discriminant < 0 ? [] : this.calculateIntersectionPoints(discriminant, a, b, pointA, pointB);
  }

  /**
   * Calculates the intersection points based on the discriminant.
   * @param discriminant - The discriminant value.
   * @param a - Coefficient 'a' in the quadratic equation.
   * @param b - Coefficient 'b' in the quadratic equation.
   * @param pointA - Starting point of the line segment.
   * @param pointB - Ending point of the line segment.
   * @returns An array of intersection points.
   */
  private static calculateIntersectionPoints(discriminant: number, a: number, b: number, pointA: IPoint, pointB: IPoint): IPoint[] {
    const points: IPoint[] = [];

    if (discriminant > 0) {
      const root = Math.sqrt(discriminant);
      const t1 = (-b - root) / a;
      const t2 = (-b + root) / a;

      if (t1 >= 0 && t1 <= 1) {
        points.push(PointExtensions.interpolatePoints(pointA, pointB, t1));
      }
      if (t2 >= 0 && t2 <= 1) {
        points.push(PointExtensions.interpolatePoints(pointA, pointB, t2));
      }
    } else {
      const t = -b / a;
      if (t >= 0 && t <= 1) {
        points.push(PointExtensions.interpolatePoints(pointA, pointB, t));
      }
    }

    return points;
  }
}
