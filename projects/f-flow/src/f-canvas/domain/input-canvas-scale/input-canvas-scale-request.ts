import { ITransformModel } from '@foblex/2d';

export class InputCanvasScaleRequest {

  constructor(
    public transform: ITransformModel,
    public scale: number | undefined
  ) {
  }
}
