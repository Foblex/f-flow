import { IPointerEvent } from "../../../drag-toolkit";

export class MinimapDragFinalizeRequest {
  static readonly fToken = Symbol('MinimapDragFinalizeRequest');

  constructor(
    public event: IPointerEvent,
  ) {
  }
}
