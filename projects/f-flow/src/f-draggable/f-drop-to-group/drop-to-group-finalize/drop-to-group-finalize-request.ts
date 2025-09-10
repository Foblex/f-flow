import { IPointerEvent } from "../../../drag-toolkit";

export class DropToGroupFinalizeRequest {
  static readonly fToken = Symbol('DropToGroupFinalizeRequest');

  constructor(
    public event: IPointerEvent,
  ) {
  }
}
