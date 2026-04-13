import { ETableRelationType } from '../e-table-relation-type';

export class CreateConnectionRequest {

  constructor(
    public readonly outputId: string,
    public readonly inputId: string,
    public readonly type: ETableRelationType
  ) {
  }
}
