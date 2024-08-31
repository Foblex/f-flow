import { IDatabaseModel } from '../i-database-model';

export class BuildFormRequest {

  constructor(
    public readonly db: IDatabaseModel,
  ) {
  }
}
