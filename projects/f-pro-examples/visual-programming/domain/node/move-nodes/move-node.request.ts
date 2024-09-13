import { IPoint } from '@foblex/2d';

export class MoveNodeRequest {

  constructor(
    public readonly id: string,
    public readonly position: IPoint,
  ) {
  }
}
