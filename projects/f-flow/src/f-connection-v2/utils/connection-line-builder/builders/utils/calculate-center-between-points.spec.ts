import { PointExtensions } from '@foblex/2d';
import { calculateCenterBetweenPoints, createPureHarness } from '@foblex/flow';

describe('calculateCenterBetweenPoints', () => {
  const pure = createPureHarness();

  it('should calculate center between two points when target.x > source.x and target.y > source.y', () => {
    const source = pure.point(0, 0);
    const target = pure.point(4, 4);

    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center between two points when target.x < source.x and target.y < source.y', () => {
    const source = pure.point(4, 4);
    const target = pure.point(0, 0);

    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center between two points when target.x > source.x and target.y < source.y', () => {
    const source = pure.point(0, 4);
    const target = pure.point(4, 0);

    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center between two points when target.x < source.x and target.y > source.y', () => {
    const source = pure.point(4, 0);
    const target = pure.point(0, 4);

    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(2, 2));
  });

  it('should calculate center when source and target are the same point', () => {
    const source = pure.point(4, 4);
    const target = pure.point(4, 4);

    const result = calculateCenterBetweenPoints(source, target);

    expect(result).toEqual(PointExtensions.initialize(4, 4));
  });
});
