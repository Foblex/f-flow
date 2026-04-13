import { ETableRelationType } from '../e-table-relation-type';

export class ChangeConnectionTypeRequest {

  constructor(
    public readonly id: string,
    public readonly type: ETableRelationType
  ) {
  }
}
