import {
  calculateAutoPanAxisDelta,
  calculateAutoPanDelta,
  rebaseAutoPanPointerDownPosition,
  resolveAutoPanMode,
} from './auto-pan.utils';

describe('auto-pan utils', () => {
  it('should resolve rebase mode for supported drag kinds with auxiliary handlers', () => {
    expect(resolveAutoPanMode(['drag-node', 'assign-to-container'])).toBe('rebase');
    expect(resolveAutoPanMode(['create-connection'])).toBe('rebase');
    expect(resolveAutoPanMode(['reassign-connection'])).toBe('rebase');
  });

  it('should resolve direct mode for selection area', () => {
    expect(resolveAutoPanMode(['selection-area'])).toBe('direct');
  });

  it('should block unsupported or mixed drag kinds', () => {
    expect(resolveAutoPanMode(['drag-canvas'])).toBeNull();
    expect(resolveAutoPanMode(['drag-node', 'selection-area'])).toBeNull();
    expect(resolveAutoPanMode(['drag-external-item'])).toBeNull();
  });

  it('should calculate constant edge speed when acceleration is disabled', () => {
    expect(calculateAutoPanAxisDelta(395, 0, 400, 40, 12, false)).toBe(-12);
    expect(calculateAutoPanAxisDelta(5, 0, 400, 40, 12, false)).toBe(12);
    expect(calculateAutoPanAxisDelta(200, 0, 400, 40, 12, false)).toBe(0);
  });

  it('should calculate linear edge speed when acceleration is enabled', () => {
    expect(calculateAutoPanAxisDelta(390, 0, 400, 40, 20, true)).toBeCloseTo(-15, 6);
    expect(calculateAutoPanAxisDelta(10, 0, 400, 40, 20, true)).toBeCloseTo(15, 6);
  });

  it('should resolve diagonal deltas independently', () => {
    const result = calculateAutoPanDelta(
      { x: 390, y: 8 },
      new DOMRect(0, 0, 400, 300),
      40,
      20,
      false,
    );

    expect(result.x).toBe(-20);
    expect(result.y).toBe(20);
  });

  it('should rebase pointer down position by the applied canvas delta', () => {
    const result = rebaseAutoPanPointerDownPosition({ x: 120, y: 80 }, { x: -20, y: 10 }, 2);

    expect(result.x).toBe(110);
    expect(result.y).toBe(85);
  });
});
