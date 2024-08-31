import { IPoint } from '@foblex/core';

export class CreateTableRequest {

  constructor(
    public readonly position: IPoint,
  ) {
  }
}
