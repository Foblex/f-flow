export function calculateTouchDistance(touches: TouchList): number | null {
  if (touches.length !== 2) {
    return null;
  }

  const firstTouch = touches[0];
  const secondTouch = touches[1];

  return Math.hypot(
    secondTouch.clientX - firstTouch.clientX,
    secondTouch.clientY - firstTouch.clientY,
  );
}
