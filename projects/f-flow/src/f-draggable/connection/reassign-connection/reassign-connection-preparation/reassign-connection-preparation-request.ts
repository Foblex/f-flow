import { FEventTrigger } from '../../../../domain';
import { IPointerEvent } from '../../../../drag-toolkit';

export class ReassignConnectionPreparationRequest {
  static readonly fToken = Symbol('ReassignConnectionPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
