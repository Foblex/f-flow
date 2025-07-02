import { FEventTrigger } from '../../../domain';
import {IPointerEvent} from "../../../drag-toolkit";

export class FNodeResizePreparationRequest {
  static readonly fToken = Symbol('FNodeResizePreparationRequest');

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger
  ) {
  }
}
