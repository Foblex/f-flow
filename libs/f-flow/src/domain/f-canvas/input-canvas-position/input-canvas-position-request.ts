import { IPoint, ITransformModel } from '../../../_libs/f-2d';

export class InputCanvasPositionRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('InputCanvasPositionRequest');
  constructor(
    public readonly transform: ITransformModel,
    public readonly position: IPoint | undefined,
  ) {}
}
