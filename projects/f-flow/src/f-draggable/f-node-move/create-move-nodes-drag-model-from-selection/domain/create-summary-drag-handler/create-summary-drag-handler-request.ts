import {MoveNodeOrGroupDragHandler} from "@foblex/flow";

export class CreateSummaryDragHandlerRequest {
  static readonly fToken = Symbol('CreateSummaryDragHandlerRequest');

  constructor(
    public readonly hierarchyRoots: MoveNodeOrGroupDragHandler[],
  ) {
  }
}
