import { FLineAlignmentBase } from '../../../f-line-alignment';

export class AddLineAlignmentToStoreRequest {
  static readonly fToken = Symbol('AddLineAlignmentToStoreRequest');
  constructor(
    public fComponent: FLineAlignmentBase,
  ) {
  }
}
