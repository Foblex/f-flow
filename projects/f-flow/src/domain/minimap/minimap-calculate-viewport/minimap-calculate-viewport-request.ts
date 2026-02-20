export class MinimapCalculateViewportRequest {
  static readonly fToken = Symbol('MinimapCalculateViewportRequest');

  constructor(
    public readonly svg: SVGSVGElement,
    public readonly minSize: number,
  ) {}
}
