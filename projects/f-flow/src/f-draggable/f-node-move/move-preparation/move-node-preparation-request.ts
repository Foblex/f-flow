import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../../drag-toolkit';

export class MoveNodePreparationRequest {
  static readonly fToken = Symbol('MoveNodePreparationRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
