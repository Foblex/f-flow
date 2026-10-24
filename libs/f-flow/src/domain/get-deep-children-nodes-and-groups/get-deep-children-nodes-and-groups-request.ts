import type { FNodeBase } from '../../f-node';
export class GetDeepChildrenNodesAndGroupsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: FNodeBase[];

  static readonly fToken = Symbol('GetDeepChildrenNodesAndGroupsRequest');
  constructor(public readonly nodeOrGroupId: string) {}
}
