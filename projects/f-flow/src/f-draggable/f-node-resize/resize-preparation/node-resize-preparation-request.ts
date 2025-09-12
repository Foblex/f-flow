import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from "../../../drag-toolkit";

export class NodeResizePreparationRequest {
  static readonly fToken = Symbol('NodeResizePreparationRequest');

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger,
  ) {
  }
}
