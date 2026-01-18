import { TestBed } from '@angular/core/testing';
import { IPoint } from '@foblex/2d';
import { sampleCubicBezierUniform } from '@foblex/flow';

describe('sampleCubicBezierUniform', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should return samples + 1 points', () => {
    const points: IPoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 0 },
    ];

    const result = sampleCubicBezierUniform(points, 10);

    expect(result.length).toBe(11);
  });

  it('should include both endpoints', () => {
    const points: IPoint[] = [
      { x: 10, y: 20 },
      { x: 15, y: 25 },
      { x: 30, y: 5 },
      { x: 40, y: 50 },
    ];

    const result = sampleCubicBezierUniform(points, 8);

    expect(result[0].x).toBeCloseTo(10);
    expect(result[0].y).toBeCloseTo(20);

    expect(result[result.length - 1].x).toBeCloseTo(40);
    expect(result[result.length - 1].y).toBeCloseTo(50);
  });

  it('should return correct point for a straight line (all control points collinear)', () => {
    const points: IPoint[] = [
      { x: 0, y: 0 }, // p0
      { x: 1, y: 0 }, // p1
      { x: 3, y: 0 }, // p2
      { x: 4, y: 0 }, // p3
    ];

    const result = sampleCubicBezierUniform(points, 4);
    // t = 0.5 for i=2 when samples=4
    expect(result[2].x).toBeCloseTo(2);
    expect(result[2].y).toBeCloseTo(0);
  });

  it('should return correct midpoint for a symmetric arch', () => {
    const points: IPoint[] = [
      { x: 0, y: 0 }, // p0
      { x: 0, y: 2 }, // p1
      { x: 4, y: 2 }, // p2
      { x: 4, y: 0 }, // p3
    ];

    const result = sampleCubicBezierUniform(points, 2);
    // i=1 => t=0.5
    expect(result[1].x).toBeCloseTo(2);
    expect(result[1].y).toBeCloseTo(1.5);
  });

  it('should work with default samples value', () => {
    const points: IPoint[] = [
      { x: 0, y: 0 },
      { x: 2, y: 3 },
      { x: 3, y: 2 },
      { x: 5, y: 0 },
    ];

    const result = sampleCubicBezierUniform(points);

    expect(result.length).toBe(33);
    expect(result[0].x).toBeCloseTo(0);
    expect(result[0].y).toBeCloseTo(0);
    expect(result[result.length - 1].x).toBeCloseTo(5);
    expect(result[result.length - 1].y).toBeCloseTo(0);
  });

  it('should clone the first point (do not keep reference)', () => {
    const p0: IPoint = { x: 1, y: 1 };
    const points: IPoint[] = [p0, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 1 }];

    const result = sampleCubicBezierUniform(points, 3);

    expect(result[0]).not.toBe(p0);
    expect(result[0].x).toBeCloseTo(1);
    expect(result[0].y).toBeCloseTo(1);
  });
});
