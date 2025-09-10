import { FEventTrigger } from '../../../../domain';
import { IPointerEvent } from "../../../../drag-toolkit";

export class FCreateConnectionPreparationRequest {
  static readonly fToken = Symbol('FCreateConnectionPreparationRequest');
  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger,
  ) {
  }
}
