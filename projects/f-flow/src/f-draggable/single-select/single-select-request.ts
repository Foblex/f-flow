import { FEventTrigger } from '../../domain';
import { IPointerEvent } from '../../drag-toolkit';

export class SingleSelectRequest {
  static readonly fToken = Symbol('SingleSelectRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly trigger: FEventTrigger,
  ) {}
}
