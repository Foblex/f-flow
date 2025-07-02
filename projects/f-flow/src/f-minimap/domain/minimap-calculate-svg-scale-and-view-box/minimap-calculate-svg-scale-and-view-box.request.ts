export class MinimapCalculateSvgScaleAndViewBoxRequest {
  static readonly fToken = Symbol('MinimapCalculateSvgScaleAndViewBoxRequest');

  constructor(
    public element: SVGSVGElement,
    public minSize: number,
  ) {
  }
}
