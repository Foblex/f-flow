import { RectExtensions } from '@foblex/2d';
import { EFReflowAxis } from '../enums';
import { EdgeBasedDeltaCalculator } from './edge-based-delta-calculator';

describe('EdgeBasedDeltaCalculator', () => {
  let calculator: EdgeBasedDeltaCalculator;

  beforeEach(() => {
    calculator = new EdgeBasedDeltaCalculator();
  });

  describe('vertical axis', () => {
    it('shifts candidate below by deltaBottom when node grows downward', () => {
      const baseline = RectExtensions.initialize(0, 0, 100, 50);
      const next = RectExtensions.initialize(0, 0, 100, 80);
      const candidate = RectExtensions.initialize(0, 70, 100, 50);

      const shift = calculator.calculate({
        baselineRect: baseline,
        nextRect: next,
        candidateRect: candidate,
        axis: EFReflowAxis.VERTICAL,
      });

      expect(shift).toEqual({ x: 0, y: 30 });
    });

    it('shifts candidate above by deltaTop (negative) when node grows upward', () => {
      const baseline = RectExtensions.initialize(0, 100, 100, 50);
      const next = RectExtensions.initialize(0, 70, 100, 80);
      const candidate = RectExtensions.initialize(0, 20, 100, 50);

      const shift = calculator.calculate({
        baselineRect: baseline,
        nextRect: next,
        candidateRect: candidate,
        axis: EFReflowAxis.VERTICAL,
      });

      expect(shift).toEqual({ x: 0, y: -30 });
    });

    it('returns null for a candidate not below or above the resized node', () => {
      const baseline = RectExtensions.initialize(0, 0, 100, 50);
      const next = RectExtensions.initialize(0, 0, 100, 80);
      const candidate = RectExtensions.initialize(200, 0, 100, 50);

      const shift = calculator.calculate({
        baselineRect: baseline,
        nextRect: next,
        candidateRect: candidate,
        axis: EFReflowAxis.VERTICAL,
      });

      expect(shift).toBeNull();
    });

    it('shifts candidate upward on vertical collapse from below', () => {
      const baseline = RectExtensions.initialize(0, 0, 100, 80);
      const next = RectExtensions.initialize(0, 0, 100, 50);
      const candidate = RectExtensions.initialize(0, 100, 100, 50);

      const shift = calculator.calculate({
        baselineRect: baseline,
        nextRect: next,
        candidateRect: candidate,
        axis: EFReflowAxis.VERTICAL,
      });

      expect(shift).toEqual({ x: 0, y: -30 });
    });
  });

  describe('horizontal axis', () => {
    it('shifts candidate to the right when node grows rightward', () => {
      const baseline = RectExtensions.initialize(0, 0, 50, 100);
      const next = RectExtensions.initialize(0, 0, 80, 100);
      const candidate = RectExtensions.initialize(70, 0, 50, 100);

      const shift = calculator.calculate({
        baselineRect: baseline,
        nextRect: next,
        candidateRect: candidate,
        axis: EFReflowAxis.HORIZONTAL,
      });

      expect(shift).toEqual({ x: 30, y: 0 });
    });

    it('shifts candidate to the left when node grows leftward', () => {
      const baseline = RectExtensions.initialize(100, 0, 50, 100);
      const next = RectExtensions.initialize(70, 0, 80, 100);
      const candidate = RectExtensions.initialize(20, 0, 50, 100);

      const shift = calculator.calculate({
        baselineRect: baseline,
        nextRect: next,
        candidateRect: candidate,
        axis: EFReflowAxis.HORIZONTAL,
      });

      expect(shift).toEqual({ x: -30, y: 0 });
    });
  });

  describe('both axes (corner resize)', () => {
    it('combines horizontal and vertical shifts independently', () => {
      const baseline = RectExtensions.initialize(0, 0, 50, 50);
      const next = RectExtensions.initialize(0, 0, 80, 80);
      const candidate = RectExtensions.initialize(70, 70, 50, 50);

      const shift = calculator.calculate({
        baselineRect: baseline,
        nextRect: next,
        candidateRect: candidate,
        axis: EFReflowAxis.BOTH,
      });

      expect(shift).toEqual({ x: 30, y: 30 });
    });
  });

  it('returns null when baseline and next are identical', () => {
    const rect = RectExtensions.initialize(0, 0, 100, 100);
    const candidate = RectExtensions.initialize(0, 120, 100, 50);

    const shift = calculator.calculate({
      baselineRect: rect,
      nextRect: rect,
      candidateRect: candidate,
      axis: EFReflowAxis.BOTH,
    });

    expect(shift).toBeNull();
  });
});
