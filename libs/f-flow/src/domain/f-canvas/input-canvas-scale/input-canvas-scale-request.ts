import { ITransformModel } from '@foblex/2d';

export class InputCanvasScaleRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('InputCanvasScaleRequest');
  constructor(
    public transform: ITransformModel,
    public scale: number | undefined,
  ) {}
}
