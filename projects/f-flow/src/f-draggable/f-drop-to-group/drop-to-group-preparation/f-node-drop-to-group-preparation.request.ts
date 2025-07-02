import {IPointerEvent} from "../../../drag-toolkit";

export class FNodeDropToGroupPreparationRequest {
  static readonly fToken = Symbol('FNodeDropToGroupPreparationRequest');
  constructor(
    public event: IPointerEvent
  ) {
  }
}
