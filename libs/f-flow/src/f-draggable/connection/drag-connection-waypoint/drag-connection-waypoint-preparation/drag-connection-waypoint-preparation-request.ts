import { IPointerEvent } from '../../../infrastructure';
import { FEventTrigger } from '../../../../domain';

export class DragConnectionWaypointPreparationRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DragConnectionWaypointPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
