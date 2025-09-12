import { MoveSummaryDragHandler } from "../move-summary-drag-handler";

export class CreateSnapLinesRequest {
  static readonly fToken = Symbol('CreateSnapLinesRequest');

  constructor(
    public readonly summaryHandler: MoveSummaryDragHandler,
  ) {
  }
}
