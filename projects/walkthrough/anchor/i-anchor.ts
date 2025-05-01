import { IAnchorPosition } from './i-anchor-position';

export interface IAnchor {
  element: HTMLElement | SVGElement;
  position: IAnchorPosition;
}
