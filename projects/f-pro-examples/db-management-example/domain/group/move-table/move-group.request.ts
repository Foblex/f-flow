import { IPoint } from '@foblex/2d';

export class MoveGroupRequest {

  constructor(
    public readonly id: string,
    public readonly position: IPoint,
  ) {
  }
}
