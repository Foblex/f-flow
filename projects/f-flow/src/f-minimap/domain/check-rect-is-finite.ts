import { IRect, RectExtensions } from '@foblex/core';

export function checkRectIsFinite(rect: IRect): IRect {
  if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height) || !Number.isFinite(rect.x) || !Number.isFinite(rect.y)) {
    return RectExtensions.initialize(0, 0, 0, 0);
  }
  return rect;
}
