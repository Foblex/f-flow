import { IntersectionFinder } from './intersection-finder';
import { Arc, IArc, ILine, IPoint, Line, Point } from '@foblex/core';
import { IRoundedRect, RoundedRect } from './rounded-rect';

describe('IntersectionFinder', () => {

  it('should find intersections between line segment and rounded rectangle', () => {
    const line: ILine = new Line(new Point(0, 0), new Point(200, 200));
    const rect: IRoundedRect = new RoundedRect(100, 100, 100, 100, 0, 0, 0, 0);

    const intersections = IntersectionFinder.getIntersections(line.point1, line.point2, rect);
    expect(intersections.length).toBeGreaterThan(0);
    expect(intersections[0].x).toEqual(100);
    expect(intersections[0].y).toEqual(100);
  });

  it('should find intersection points between an arc and a line segment', () => {
    const arc: IArc = new Arc(new Point(100, 100), 50, 50, 0, Math.PI / 2);
    const line: ILine = new Line(new Point(0, 0), new Point(200, 200));

    const intersections = IntersectionFinder['intersectArcWithLine'](arc, line.point1, line.point2);
    expect(intersections.length).toBeGreaterThan(0);
  });

  it('should find intersection point between two line segments', () => {
    const p1: IPoint = { x: 0, y: 0 };
    const p2: IPoint = { x: 200, y: 200 };
    const p3: IPoint = { x: 0, y: 200 };
    const p4: IPoint = { x: 200, y: 0 };

    const intersection = IntersectionFinder['intersectLineSegments'](p1, p2, p3, p4);

    expect(intersection).not.toBeNull();
    expect(intersection!.x).toEqual(100);
    expect(intersection!.y).toEqual(100);
  });

  it('should filter points within an arc', () => {
    const points: IPoint[] = [
      { x: 100, y: 100 },
      { x: 200, y: 200 }
    ];
    const arc: IArc = new Arc(new Point(150, 150), 50, 50, 0, Math.PI / 2);

    const filteredPoints = IntersectionFinder['filterPointsWithinArc'](points, arc);

    expect(filteredPoints.length).toBeGreaterThan(0);
  });

  it('should normalize angle to be within 0 to 2π', () => {
    const angle = -Math.PI;

    const normalizedAngle = IntersectionFinder['normalizeAngle'](angle);

    expect(normalizedAngle).toBeGreaterThanOrEqual(0);
    expect(normalizedAngle).toBeLessThanOrEqual(2 * Math.PI);
  });

  it('should find intersections between ellipse and line segment', () => {
    const center: IPoint = { x: 100, y: 100 };
    const radiusX = 50;
    const radiusY = 50;
    const pointA: IPoint = { x: 0, y: 0 };
    const pointB: IPoint = { x: 200, y: 200 };

    const intersections = IntersectionFinder['findEllipseLineIntersections'](center, radiusX, radiusY, pointA, pointB);

    expect(intersections.length).toBeGreaterThan(0);
  });

  it('should calculate intersection points based on discriminant', () => {
    const discriminant = 1;
    const a = 1;
    const b = -2;
    const pointA: IPoint = { x: 0, y: 0 };
    const pointB: IPoint = { x: 200, y: 200 };

    const points = IntersectionFinder['calculateIntersectionPoints'](discriminant, a, b, pointA, pointB);

    expect(points.length).toBeGreaterThan(0);
  });
});
