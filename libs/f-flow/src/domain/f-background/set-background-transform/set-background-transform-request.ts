import { ITransformModel } from '@foblex/2d';

export class SetBackgroundTransformRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('SetBackgroundTransformRequest');

  constructor(public fTransform: ITransformModel) {}
}
