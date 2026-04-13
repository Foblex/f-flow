import { IPoint } from '@foblex/2d';

export class FitToFlowRequest {
  static readonly fToken = Symbol('FitToFlowRequest');
  constructor(
    public readonly toCenter: IPoint,
    public readonly animated: boolean,
  ) {}
}
