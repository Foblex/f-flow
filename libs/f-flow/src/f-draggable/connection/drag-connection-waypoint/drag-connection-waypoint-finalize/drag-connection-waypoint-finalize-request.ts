import { IPointerEvent } from '../../../infrastructure';

export class DragConnectionWaypointFinalizeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DragConnectionWaypointFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
