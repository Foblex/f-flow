import { IPoint } from '@foblex/2d';

export class FitToFlowRequest {
  static readonly fToken = Symbol('FitToFlowRequest');
  constructor(
    public toCenter: IPoint,
    public animated: boolean,
  ) {
  }
}
