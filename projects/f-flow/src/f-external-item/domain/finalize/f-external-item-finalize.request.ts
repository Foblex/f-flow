import { IPointerEvent } from "../../../drag-toolkit";

export class FExternalItemFinalizeRequest {
  static readonly fToken = Symbol('FExternalItemFinalizeRequest');

  constructor(
    public event: IPointerEvent,
  ) {
  }
}
