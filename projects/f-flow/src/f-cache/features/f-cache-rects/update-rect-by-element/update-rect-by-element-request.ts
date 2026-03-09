import { IRect, IRoundedRect } from '@foblex/2d';

export class UpdateFCacheRectByElementRequest {
  static readonly fToken = Symbol('UpdateFCacheRectByElementRequest');

  constructor(
    public readonly element: HTMLElement | SVGElement,
    public readonly rect: IRect | IRoundedRect,
  ) {}
}
