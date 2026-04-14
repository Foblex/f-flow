import { RoundedRect } from '@foblex/2d';
import { getRotatedRoundedRectIntersection } from './get-rotated-rounded-rect-intersection';

describe('getRotatedRoundedRectIntersection', () => {
  it('returns the existing axis-aligned intersection when no rotation is provided', () => {
    const rect = new RoundedRect(80, 90, 40, 20, 0, 0, 0, 0);

    expect(getRotatedRoundedRectIntersection({ x: 100, y: 100 }, { x: 200, y: 100 }, rect)).toEqual(
      { x: 120, y: 100 },
    );
  });

  it('calculates the correct border point for a rect rotated around its own center', () => {
    const rect = new RoundedRect(80, 90, 40, 20, 0, 0, 0, 0);

    expect(
      getRotatedRoundedRectIntersection({ x: 100, y: 100 }, { x: 200, y: 100 }, rect, {
        rotationDeg: 90,
        pivot: { x: 100, y: 100 },
      }),
    ).toEqual({ x: 110, y: 100 });
  });

  it('supports rotation around an external node pivot', () => {
    const rect = new RoundedRect(80, 120, 40, 20, 0, 0, 0, 0);

    expect(
      getRotatedRoundedRectIntersection({ x: 100, y: 130 }, { x: 200, y: 130 }, rect, {
        rotationDeg: 90,
        pivot: { x: 100, y: 100 },
      }),
    ).toEqual({ x: 110, y: 130 });
  });
});
