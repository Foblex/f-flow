import { MoveDragHandler } from "../../move-drag-handler";

export class CreateSummaryDragHandlerRequest {
  static readonly fToken = Symbol('CreateSummaryDragHandlerRequest');

  constructor(
    public readonly dragRoots: MoveDragHandler[],
    public readonly participant: MoveDragHandler[],
  ) {
  }
}
