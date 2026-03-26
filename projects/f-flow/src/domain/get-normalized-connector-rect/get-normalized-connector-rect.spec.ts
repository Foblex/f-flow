import { GetNormalizedConnectorRect } from './get-normalized-connector-rect';

describe('get-normalized-connector-rect', () => {
  const normalizeCircularBorderRadii = (
    width: number,
    height: number,
    radii: [number, number, number, number],
  ): [number, number, number, number] => {
    const execution = Object.create(
      GetNormalizedConnectorRect.prototype,
    ) as GetNormalizedConnectorRect;

    return execution['_normalizeCircularBorderRadii'](width, height, radii);
  };

  describe('_normalizeCircularBorderRadii', () => {
    it('should keep radii that already fit the rect', () => {
      expect(normalizeCircularBorderRadii(16, 16, [4, 4, 4, 4])).toEqual([4, 4, 4, 4]);
    });

    it('should clamp oversized radii like border-radius 999px on a circle', () => {
      expect(normalizeCircularBorderRadii(16, 16, [999, 999, 999, 999])).toEqual([8, 8, 8, 8]);
    });

    it('should scale all corners proportionally when adjacent sums overflow', () => {
      expect(normalizeCircularBorderRadii(16, 10, [10, 10, 10, 10])).toEqual([5, 5, 5, 5]);
    });
  });
});
