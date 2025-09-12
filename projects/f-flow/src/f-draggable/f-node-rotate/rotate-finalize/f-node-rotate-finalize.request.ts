import { IPointerEvent } from "../../../drag-toolkit";

export class FNodeRotateFinalizeRequest {
  static readonly fToken = Symbol('FNodeRotateFinalizeRequest');

  constructor(
    public event: IPointerEvent,
  ) {
  }
}
