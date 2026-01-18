import { IPointerEvent } from '../../../../drag-toolkit';
import { FEventTrigger } from '../../../../domain';

export class MoveControlPointPreparationRequest {
  static readonly fToken = Symbol('MoveControlPointPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
