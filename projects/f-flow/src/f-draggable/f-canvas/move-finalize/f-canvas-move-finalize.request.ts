import { IPointerEvent } from "../../../drag-toolkit";

export class FCanvasMoveFinalizeRequest {
  static readonly fToken = Symbol('FCanvasMoveFinalizeRequest');
  constructor(
    public event: IPointerEvent,
  ) {
  }
}
