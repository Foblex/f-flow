import { IPoint } from '@foblex/2d';

export class MoveTableRequest {

  constructor(
    public readonly id: string,
    public readonly position: IPoint,
  ) {
  }
}
