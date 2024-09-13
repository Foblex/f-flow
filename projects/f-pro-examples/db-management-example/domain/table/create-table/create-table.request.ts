import { IPoint } from '@foblex/2d';

export class CreateTableRequest {

  constructor(
    public readonly position: IPoint,
  ) {
  }
}
