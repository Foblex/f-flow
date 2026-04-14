import { ITransformModel } from '@foblex/2d';

export class SetBackgroundTransformRequest {
  static readonly fToken = Symbol('SetBackgroundTransformRequest');

  constructor(
    public fTransform: ITransformModel,
  ) {
  }
}
