import { FNodeBase } from '../../../f-node';

export class RemoveNodeFromStoreRequest {
  static readonly fToken = Symbol('RemoveNodeFromStoreRequest');
  constructor(
    public fComponent: FNodeBase,
  ) {
  }
}
