import { FEventTrigger } from '../../domain';
import { IPointerEvent } from "../../drag-toolkit";

export class FSingleSelectRequest {
  static readonly fToken = Symbol('FSingleSelectRequest');

  constructor(
    public event: IPointerEvent,
    public fMultiSelectTrigger: FEventTrigger,
  ) {
  }
}
