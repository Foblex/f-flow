import { ECanvasRedrawContext } from './e-canvas-redraw-context';

export class RedrawCanvasWithAnimationRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RedrawCanvasWithAnimationRequest');
  constructor(
    public readonly animated: boolean,
    public readonly context: ECanvasRedrawContext = ECanvasRedrawContext.WITH_CONNECTION_CHANGES,
    public readonly emitCanvasChange: boolean = true,
  ) {}
}
