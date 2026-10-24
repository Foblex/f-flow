import { IRect } from './i-rect';
import { RectExtensions } from './rect.extensions';

export function setRectToElement(rect: IRect, element: SVGElement): void {
  rect = RectExtensions.updateIsNotFinite(rect);
  element.setAttribute('x', rect.x.toString());
  element.setAttribute('y', rect.y.toString());
  element.setAttribute('width', rect.width.toString());
  element.setAttribute('height', rect.height.toString());
}
