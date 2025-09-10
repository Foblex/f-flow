import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from "../../../drag-toolkit";

export class FExternalItemPreparationRequest {
  static readonly fToken = Symbol('FExternalItemPreparationRequest');

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger,
  ) {
  }
}
