import {MoveNodeOrGroupDragHandler} from "../../move-node-or-group.drag-handler";

export class CreateSummaryDragHandlerRequest {
  static readonly fToken = Symbol('CreateSummaryDragHandlerRequest');

  constructor(
    public readonly hierarchyRoots: MoveNodeOrGroupDragHandler[],
  ) {
  }
}
