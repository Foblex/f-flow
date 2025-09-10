import { IPointerEvent } from "../../../../drag-toolkit";

export class FCreateConnectionFinalizeRequest {
  static readonly fToken = Symbol('FCreateConnectionFinalizeRequest');
  constructor(
    public event: IPointerEvent,
  ) {
  }
}
