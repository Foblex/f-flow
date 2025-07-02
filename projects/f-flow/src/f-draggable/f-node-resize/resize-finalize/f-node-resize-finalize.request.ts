import {IPointerEvent} from "../../../drag-toolkit";

export class FNodeResizeFinalizeRequest {
  static readonly fToken = Symbol('FNodeResizeFinalizeRequest');

  constructor(
    public event: IPointerEvent
  ) {
  }
}
