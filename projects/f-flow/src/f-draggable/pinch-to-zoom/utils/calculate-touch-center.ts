import { IPoint, PointExtensions } from '@foblex/2d';

export function calculateTouchCenter(touches: TouchList): IPoint | null {
  if (touches.length !== 2) {
    return null;
  }

  const firstTouch = touches[0];
  const secondTouch = touches[1];

  return PointExtensions.initialize(
    (firstTouch.clientX + secondTouch.clientX) / 2,
    (firstTouch.clientY + secondTouch.clientY) / 2,
  );
}
