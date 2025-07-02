import {IPointerEvent} from "../../../drag-toolkit";

export class FNodeDropToGroupFinalizeRequest {
  static readonly fToken = Symbol('FNodeDropToGroupFinalizeRequest');
  constructor(
    public event: IPointerEvent
  ) {
  }
}
