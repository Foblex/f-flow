import { FNodeBase } from '../../../f-node';

export class SelectAndUpdateNodeLayerRequest {
  static readonly fToken = Symbol('SelectAndUpdateNodeLayerRequest');
  constructor(
    public fNode: FNodeBase,
  ) {
  }
}
