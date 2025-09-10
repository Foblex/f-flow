export class RedrawCanvasWithAnimationRequest {
  static readonly fToken = Symbol('RedrawCanvasWithAnimationRequest');
  constructor(
    public animated: boolean,
  ) {
  }
}
