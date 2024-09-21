import { IPoint } from '@foblex/2d';

export class UpdateScaleRequest {

  constructor(
    public scale: number,
    public toPosition: IPoint
  ) {
  }
}
