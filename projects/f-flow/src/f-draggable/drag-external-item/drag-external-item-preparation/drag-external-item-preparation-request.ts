import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../../drag-toolkit';

export class DragExternalItemPreparationRequest {
  static readonly fToken = Symbol('DragExternalItemPreparationRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
