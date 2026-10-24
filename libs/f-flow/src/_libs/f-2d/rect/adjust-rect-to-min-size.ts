import { IRect } from './i-rect';
import { RectExtensions } from './rect.extensions';

export function adjustRectToMinSize(rect: IRect, minSize: number): IRect {
  const width = Math.max(rect.width, minSize);
  const height = Math.max(rect.height, minSize);
  const offsetX = (width - rect.width) / 2;
  const offsetY = (height - rect.height) / 2;

  return RectExtensions.initialize(rect.x - offsetX, rect.y - offsetY, width, height);
}
