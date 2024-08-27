import { IPoint } from '@foblex/core';

export class MoveNodeRequest {

  constructor(
    public readonly id: string,
    public readonly position: IPoint,
  ) {
  }
}
