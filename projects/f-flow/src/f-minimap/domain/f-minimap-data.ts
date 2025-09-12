import { IRect, RectExtensions } from '@foblex/2d';

export class FMinimapData {

  constructor(
    public element: SVGSVGElement,
    public scale: number = 1,
    public viewBox: IRect = RectExtensions.initialize(0, 0, 0, 0),
  ) {
  }
}
