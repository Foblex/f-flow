import { IPointerEvent } from "../../../drag-toolkit";

export class NodeResizeFinalizeRequest {
  static readonly fToken = Symbol('NodeResizeFinalizeRequest');

  constructor(
    public readonly event: IPointerEvent,
  ) {
  }
}
