import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from "../../../drag-toolkit";

export class FCanvasMovePreparationRequest {
  static readonly fToken = Symbol('FCanvasMovePreparationRequest');
  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger,
  ) {
  }
}
