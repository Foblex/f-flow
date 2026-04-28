import { IPointerEvent } from '../../../infrastructure';

export class DragConnectionWaypointFinalizeRequest {
  static readonly fToken = Symbol('DragConnectionWaypointFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
