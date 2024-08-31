import { IPoint } from '@foblex/core';

export class MoveTableRequest {

  constructor(
    public readonly id: string,
    public readonly position: IPoint,
  ) {
  }
}
