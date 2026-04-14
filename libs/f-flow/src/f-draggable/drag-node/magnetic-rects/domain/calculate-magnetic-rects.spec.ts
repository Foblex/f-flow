import { IRect } from '@foblex/2d';
import { calculateMagneticRects, createPureHarness } from '@foblex/flow';

describe('calculateMagneticRects', () => {
  const pure = createPureHarness();

  const rect = (x: number, y: number, width: number, height: number): IRect => ({
    x,
    y,
    width,
    height,
    gravityCenter: pure.point(x + width / 2, y + height / 2),
  });

  it('should return empty result when aligned candidates do not exist', () => {
    const elements = [rect(0, 200, 100, 100), rect(200, 400, 100, 100)];
    const target = rect(120, 0, 80, 100);

    const result = calculateMagneticRects(elements, target, 10, 10);

    expect(result.axis).toBeUndefined();
    expect(result.delta).toBeUndefined();
    expect(result.gap).toBeUndefined();
    expect(result.rects).toEqual([]);
  });

  it('should return empty result when candidate exists but target is outside spacing threshold', () => {
    const elements = [rect(0, 0, 100, 100), rect(150, 0, 100, 100)];
    const target = rect(500, 0, 80, 100);

    const result = calculateMagneticRects(elements, target, 10, 10);

    expect(result.axis).toBeUndefined();
    expect(result.delta).toBeUndefined();
    expect(result.gap).toBeUndefined();
    expect(result.rects).toEqual([]);
  });

  it('should return active horizontal spacing snap with expected delta and rects', () => {
    const elements = [rect(0, 0, 100, 100), rect(150, 0, 100, 100)];
    const target = rect(304, 0, 80, 100);

    const result = calculateMagneticRects(elements, target, 10, 10);

    expect(result.axis).toBe('x');
    expect(result.delta).toBe(4);
    expect(result.gap).toBe(50);
    expect(result.rects.length).toBe(2);
    expect(result.rects[0]).toEqual({ left: 100, top: 0, width: 50, height: 100 });
    expect(result.rects[1]).toEqual({ left: 250, top: 0, width: 50, height: 100 });
  });

  it('should resolve equal deltas using stable scan order', () => {
    const elements = [rect(0, 0, 100, 100), rect(150, 0, 100, 100)];
    const target = rect(304, 0, 80, 100);

    const result = calculateMagneticRects(elements, target, 10, 10);

    expect(result.axis).toBe('x');
    expect(result.alignMode).toBe('top');
  });
});
