import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from "../../../drag-toolkit";

export class FNodeRotatePreparationRequest {
  static readonly fToken = Symbol('FNodeRotatePreparationRequest');

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger,
  ) {
  }
}
