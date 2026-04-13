import { ITransformModel } from '@foblex/2d';

export class InputCanvasScaleRequest {
  static readonly fToken = Symbol('InputCanvasScaleRequest');
  constructor(
    public transform: ITransformModel,
    public scale: number | undefined,
  ) {
  }
}
