import { IPointerEvent } from "../../../drag-toolkit";

export class FNodeMoveFinalizeRequest {
  static readonly fToken = Symbol('FNodeMoveFinalizeRequest');

  constructor(
    public event: IPointerEvent,
  ) {
  }
}
