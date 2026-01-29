import { FNodeBase } from "../../../../f-node";

export class BuildDragHierarchyRequest {
  static readonly fToken = Symbol('BuildDragHierarchyRequest');

  // selected nodes and groups including their children
  constructor(
    public readonly items: FNodeBase[],
  ) {
  }
}
