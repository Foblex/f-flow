import { IPoint, ITransformModel } from '@foblex/2d';

export class InputCanvasPositionRequest {
  static readonly fToken = Symbol('InputCanvasPositionRequest');
  constructor(
    public readonly transform: ITransformModel,
    public readonly position: IPoint | undefined,
  ) {}
}
