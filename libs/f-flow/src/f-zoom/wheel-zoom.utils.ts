const DEFAULT_WHEEL_INTENSITY_MIN = 0.1;
const DEFAULT_WHEEL_INTENSITY_MAX = 1;
const GESTURE_WHEEL_DELTA_THRESHOLD = 0.5;
const GESTURE_WHEEL_INTENSITY_DIVISOR = 60;
const GESTURE_WHEEL_INTENSITY_MAX = 0.5;

/** Approximate pixel size of one wheel "line" for `DOM_DELTA_LINE` events. */
const WHEEL_LINE_HEIGHT = 16;
/** Approximate pixel size of one wheel "page" for `DOM_DELTA_PAGE` events. */
const WHEEL_PAGE_HEIGHT = 400;

export function resolveWheelDelta(event: WheelEvent): number {
  // With Shift pressed many browsers emit horizontal wheel (deltaX) and keep deltaY near 0.
  return Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
}

/**
 * Resolve a two-dimensional scroll delta in CSS pixels for scroll-to-pan.
 *
 * Unlike {@link resolveWheelDelta} (which collapses to a single dominant axis for zoom),
 * panning needs both axes so that trackpad two-finger scroll and Shift+wheel move the
 * viewport diagonally/horizontally. `deltaMode` is normalized to pixels.
 */
export function resolveScrollPanDelta(event: WheelEvent): { x: number; y: number } {
  const factor =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? WHEEL_LINE_HEIGHT
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? WHEEL_PAGE_HEIGHT
        : 1;

  return { x: event.deltaX * factor, y: event.deltaY * factor };
}

export function normalizeWheelStep(event: WheelEvent, delta: number, step: number): number {
  return isGestureWheelEvent(event)
    ? normalizeGestureWheelStep(delta, step)
    : normalizeMouseWheelStep(delta, step);
}

export function isGestureWheelEvent(event: WheelEvent): boolean {
  return (event.ctrlKey || event.metaKey) && event.deltaMode === WheelEvent.DOM_DELTA_PIXEL;
}

function normalizeMouseWheelStep(delta: number, step: number): number {
  const intensity = Math.abs(delta) / 100;
  const normalized = clamp(intensity, DEFAULT_WHEEL_INTENSITY_MIN, DEFAULT_WHEEL_INTENSITY_MAX);

  return step * normalized;
}

function normalizeGestureWheelStep(delta: number, step: number): number {
  if (Math.abs(delta) < GESTURE_WHEEL_DELTA_THRESHOLD) {
    return 0;
  }

  const intensity = Math.abs(delta) / GESTURE_WHEEL_INTENSITY_DIVISOR;
  const normalized = clamp(intensity, 0, GESTURE_WHEEL_INTENSITY_MAX);

  return step * normalized;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
