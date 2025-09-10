import { FNodeBase } from "../../../../f-node";

export class BuildDragHierarchyRequest {
  static readonly fToken = Symbol('BuildDragHierarchyRequest');

  constructor(
    public selectedNodesAndGroupsWithChildren: FNodeBase[],
  ) {
  }
}
