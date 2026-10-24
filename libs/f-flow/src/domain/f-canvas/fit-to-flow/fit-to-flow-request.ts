import { IPoint } from '@foblex/2d';

export class FitToFlowRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('FitToFlowRequest');
  constructor(
    public readonly toCenter: IPoint,
    public readonly animated: boolean,
    public readonly emitCanvasChange: boolean = true,
    public readonly maxScale?: number,
  ) {}
}
