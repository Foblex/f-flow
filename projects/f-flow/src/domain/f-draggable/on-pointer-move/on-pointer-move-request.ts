import { IPointerEvent } from "../../../drag-toolkit";

export class OnPointerMoveRequest {
  static readonly fToken = Symbol('OnPointerMoveRequest');

  constructor(
    public event: IPointerEvent,
  ) {
  }
}
