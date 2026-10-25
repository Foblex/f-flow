import type { IMinimapViewport } from './i-minimap-viewport';
export class MinimapCalculateViewportRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IMinimapViewport;

  static readonly fToken = Symbol('MinimapCalculateViewportRequest');

  constructor(
    public readonly svg: SVGSVGElement,
    public readonly minSize: number,
  ) {}
}
