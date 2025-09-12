import { IPointerEvent } from "../../../drag-toolkit";

export class SelectionAreaFinalizeRequest {
  static readonly fToken = Symbol('SelectionAreaFinalizeRequest');

  constructor(
    public event: IPointerEvent,
  ) {
  }
}
