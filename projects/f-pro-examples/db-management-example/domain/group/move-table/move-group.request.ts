import { IPoint } from '@foblex/core';

export class MoveGroupRequest {

  constructor(
    public readonly id: string,
    public readonly position: IPoint,
  ) {
  }
}
