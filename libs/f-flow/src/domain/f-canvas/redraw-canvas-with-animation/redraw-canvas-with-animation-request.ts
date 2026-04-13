import { ECanvasRedrawContext } from './e-canvas-redraw-context';

export class RedrawCanvasWithAnimationRequest {
  static readonly fToken = Symbol('RedrawCanvasWithAnimationRequest');
  constructor(
    public readonly animated: boolean,
    public readonly context: ECanvasRedrawContext = ECanvasRedrawContext.WITH_CONNECTION_CHANGES,
  ) {}
}
