import { IPoint } from '@foblex/2d';
import { createPureHarness, sampleCubicBezierUniform } from '@foblex/flow';

describe('sampleCubicBezierUniform', () => {
  const pure = createPureHarness();

  it('should return samples + 1 points', () => {
    const points: IPoint[] = [
      pure.point(0, 0),
      pure.point(1, 2),
      pure.point(3, 2),
      pure.point(4, 0),
    ];

    const result = sampleCubicBezierUniform(points, 10);

    expect(result.length).toBe(11);
  });

  it('should include both endpoints', () => {
    const points: IPoint[] = [
      pure.point(10, 20),
      pure.point(15, 25),
      pure.point(30, 5),
      pure.point(40, 50),
    ];

    const result = sampleCubicBezierUniform(points, 8);

    expect(result[0].x).toBeCloseTo(10);
    expect(result[0].y).toBeCloseTo(20);

    expect(result[result.length - 1].x).toBeCloseTo(40);
    expect(result[result.length - 1].y).toBeCloseTo(50);
  });

  it('should return correct point for a straight line (all control points collinear)', () => {
    const points: IPoint[] = [
      pure.point(0, 0),
      pure.point(1, 0),
      pure.point(3, 0),
      pure.point(4, 0),
    ];

    const result = sampleCubicBezierUniform(points, 4);

    expect(result[2].x).toBeCloseTo(2);
    expect(result[2].y).toBeCloseTo(0);
  });

  it('should return correct midpoint for a symmetric arch', () => {
    const points: IPoint[] = [
      pure.point(0, 0),
      pure.point(0, 2),
      pure.point(4, 2),
      pure.point(4, 0),
    ];

    const result = sampleCubicBezierUniform(points, 2);

    expect(result[1].x).toBeCloseTo(2);
    expect(result[1].y).toBeCloseTo(1.5);
  });

  it('should work with default samples value', () => {
    const points: IPoint[] = [
      pure.point(0, 0),
      pure.point(2, 3),
      pure.point(3, 2),
      pure.point(5, 0),
    ];

    const result = sampleCubicBezierUniform(points);

    expect(result.length).toBe(33);
    expect(result[0].x).toBeCloseTo(0);
    expect(result[0].y).toBeCloseTo(0);
    expect(result[result.length - 1].x).toBeCloseTo(5);
    expect(result[result.length - 1].y).toBeCloseTo(0);
  });

  it('should clone the first point (do not keep reference)', () => {
    const p0: IPoint = pure.point(1, 1);
    const points: IPoint[] = [p0, pure.point(2, 2), pure.point(3, 2), pure.point(4, 1)];

    const result = sampleCubicBezierUniform(points, 3);

    expect(result[0]).not.toBe(p0);
    expect(result[0].x).toBeCloseTo(1);
    expect(result[0].y).toBeCloseTo(1);
  });
});
