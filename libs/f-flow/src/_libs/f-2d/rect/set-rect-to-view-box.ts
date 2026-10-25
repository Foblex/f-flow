import { IRect } from './i-rect';
import { RectExtensions } from './rect.extensions';

export function setRectToViewBox(rect: IRect, element: SVGSVGElement): void {
  rect = RectExtensions.updateIsNotFinite(rect);
  element.setAttribute('viewBox', `${rect.x} ${rect.y} ${rect.width} ${rect.height}`);
}
