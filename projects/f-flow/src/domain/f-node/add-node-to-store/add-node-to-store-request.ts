import { FNodeBase } from '../../../f-node';

export class AddNodeToStoreRequest {
  static readonly fToken = Symbol('AddNodeToStoreRequest');
  constructor(
    public fComponent: FNodeBase,
  ) {
  }
}
