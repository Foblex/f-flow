import { IRect, RectExtensions } from '../../_libs/f-2d';

export class FMinimapState {
  constructor(
    public element: SVGSVGElement,
    public scale: number = 1,
    public viewBox: IRect = RectExtensions.initialize(0, 0, 0, 0),
  ) {}
}
