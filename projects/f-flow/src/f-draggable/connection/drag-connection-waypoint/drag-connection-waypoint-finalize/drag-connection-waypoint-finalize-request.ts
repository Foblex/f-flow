import { IPointerEvent } from '../../../../drag-toolkit';

export class DragConnectionWaypointFinalizeRequest {
  static readonly fToken = Symbol('DragConnectionWaypointFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
