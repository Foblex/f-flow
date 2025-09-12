import { IPointerEvent } from "../../../drag-toolkit";

export class DropToGroupPreparationRequest {
  static readonly fToken = Symbol('DropToGroupPreparationRequest');

  constructor(
    public event: IPointerEvent,
  ) {
  }
}
