import { IPoint } from '@foblex/2d';

export class FitToFlowRequest {

  constructor(
    public toCenter: IPoint,
    public animated: boolean
  ) {
  }
}
