import { IPoint, ITransformModel } from '@foblex/2d';

export class InputCanvasPositionRequest {
  static readonly fToken = Symbol('InputCanvasPositionRequest');
  constructor(
    public transform: ITransformModel,
    public position: IPoint | undefined,
  ) {
  }
}
