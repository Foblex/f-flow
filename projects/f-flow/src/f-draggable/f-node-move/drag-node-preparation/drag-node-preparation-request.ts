import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../../drag-toolkit';

export class DragNodePreparationRequest {
  static readonly fToken = Symbol('DragNodePreparationRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly trigger: FEventTrigger,
  ) {}
}
