import { IRect, IRoundedRect } from '@foblex/2d';

export class UpdateFCacheRectByElementRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('UpdateFCacheRectByElementRequest');

  constructor(
    public readonly element: HTMLElement | SVGElement,
    public readonly rect: IRect | IRoundedRect,
  ) {}
}
