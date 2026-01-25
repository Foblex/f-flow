import { IPointerEvent } from '../../../../drag-toolkit';
import { FEventTrigger } from '../../../../domain';

export class MoveConnectionWaypointPreparationRequest {
  static readonly fToken = Symbol('MoveConnectionWaypointPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
