import type { IRoundedRect } from '../../_libs/f-2d';
export class GetNormalizedConnectorRectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IRoundedRect;

  static readonly fToken = Symbol('GetNormalizedConnectorRectRequest');

  constructor(
    public readonly element: HTMLElement | SVGElement,
    public readonly cache: boolean = true,
  ) {}
}
