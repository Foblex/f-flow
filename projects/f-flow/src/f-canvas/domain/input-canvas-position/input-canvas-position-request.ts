import { IPoint, ITransformModel } from '@foblex/2d';

export class InputCanvasPositionRequest {

  constructor(
    public transform: ITransformModel,
    public position: IPoint | undefined
  ) {
  }
}
