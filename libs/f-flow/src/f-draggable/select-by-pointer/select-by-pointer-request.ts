import { FEventTrigger } from '../../domain';
import { IPointerEvent } from '../../drag-toolkit';

export class SelectByPointerRequest {
  static readonly fToken = Symbol('SelectByPointerRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly trigger: FEventTrigger,
  ) {}
}
