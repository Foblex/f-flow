import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from "../../../drag-toolkit";

export class FNodeMovePreparationRequest {
  static readonly fToken = Symbol('FNodeMovePreparationRequest');

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger,
  ) {
  }
}
