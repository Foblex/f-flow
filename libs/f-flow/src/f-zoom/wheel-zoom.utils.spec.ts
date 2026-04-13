import { isGestureWheelEvent, normalizeWheelStep, resolveWheelDelta } from './wheel-zoom.utils';

describe('wheel zoom utils', () => {
  it('should resolve the dominant wheel axis delta', () => {
    expect(resolveWheelDelta(createWheelEvent({ deltaX: 120, deltaY: 30 }))).toBe(120);
    expect(resolveWheelDelta(createWheelEvent({ deltaX: 20, deltaY: -80 }))).toBe(-80);
  });

  it('should detect pixel-based gesture wheel events from trackpad pinch', () => {
    expect(
      isGestureWheelEvent(
        createWheelEvent({ ctrlKey: true, deltaMode: WheelEvent.DOM_DELTA_PIXEL }),
      ),
    ).toBeTrue();
    expect(
      isGestureWheelEvent(
        createWheelEvent({ metaKey: true, deltaMode: WheelEvent.DOM_DELTA_PIXEL }),
      ),
    ).toBeTrue();
    expect(
      isGestureWheelEvent(
        createWheelEvent({ ctrlKey: true, deltaMode: WheelEvent.DOM_DELTA_LINE }),
      ),
    ).toBeFalse();
  });

  it('should preserve the minimum step for regular mouse wheel zoom', () => {
    const event = createWheelEvent({ deltaY: 1 });

    expect(normalizeWheelStep(event, 1, 0.1)).toBeCloseTo(0.01, 6);
    expect(normalizeWheelStep(event, 400, 0.1)).toBeCloseTo(0.1, 6);
  });

  it('should scale trackpad pinch smoothly without applying the mouse wheel floor', () => {
    const event = createWheelEvent({
      ctrlKey: true,
      deltaMode: WheelEvent.DOM_DELTA_PIXEL,
      deltaY: 6,
    });

    expect(normalizeWheelStep(event, 6, 0.1)).toBeCloseTo(0.01, 6);
    expect(normalizeWheelStep(event, 1, 0.1)).toBeCloseTo(1 / 600, 6);
  });

  it('should ignore tiny gesture-wheel noise and cap large pinch deltas', () => {
    const event = createWheelEvent({
      ctrlKey: true,
      deltaMode: WheelEvent.DOM_DELTA_PIXEL,
      deltaY: 0.25,
    });

    expect(normalizeWheelStep(event, 0.25, 0.1)).toBe(0);
    expect(
      normalizeWheelStep(
        createWheelEvent({
          ctrlKey: true,
          deltaMode: WheelEvent.DOM_DELTA_PIXEL,
          deltaY: 120,
        }),
        120,
        0.1,
      ),
    ).toBeCloseTo(0.05, 6);
  });
});

function createWheelEvent(init: Partial<WheelEventInit> & { deltaMode?: number } = {}): WheelEvent {
  const event = new WheelEvent('wheel', init);

  Object.defineProperty(event, 'deltaMode', {
    configurable: true,
    value: init.deltaMode ?? WheelEvent.DOM_DELTA_PIXEL,
  });

  return event;
}
