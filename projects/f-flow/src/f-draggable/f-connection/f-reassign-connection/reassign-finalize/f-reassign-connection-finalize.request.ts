import { IPointerEvent } from "../../../../drag-toolkit";

export class FReassignConnectionFinalizeRequest {
  static readonly fToken = Symbol('FReassignConnectionFinalizeRequest');
  constructor(
    public event: IPointerEvent,
  ) {
  }
}
