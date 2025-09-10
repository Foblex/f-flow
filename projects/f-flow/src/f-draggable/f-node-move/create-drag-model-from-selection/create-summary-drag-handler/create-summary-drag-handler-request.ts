import { MoveDragHandler } from "../../move-drag-handler";

export class CreateSummaryDragHandlerRequest {
  static readonly fToken = Symbol('CreateSummaryDragHandlerRequest');

  constructor(
    public readonly roots: MoveDragHandler[],
    public readonly list: MoveDragHandler[],
  ) {
  }
}
