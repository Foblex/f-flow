import { FNodeBase } from '../../../f-node';

export class FitToChildNodesAndGroupsRequest {
  static readonly fToken = Symbol('FitToChildNodesAndGroupsRequest');

  constructor(
    public readonly nodeOrGroup: FNodeBase,
  ) {
  }
}
