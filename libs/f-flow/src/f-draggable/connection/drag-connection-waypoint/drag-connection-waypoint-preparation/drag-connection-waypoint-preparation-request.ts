import { IPointerEvent } from '../../../infrastructure';
import { FEventTrigger } from '../../../../domain';

export class DragConnectionWaypointPreparationRequest {
  static readonly fToken = Symbol('DragConnectionWaypointPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
