import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../../drag-toolkit';

export class ResizeNodePreparationRequest {
  static readonly fToken = Symbol('ResizeNodePreparationRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
