import { IPointerEvent } from '../../../../drag-toolkit';

export class MoveConnectionWaypointFinalizeRequest {
  static readonly fToken = Symbol('MoveConnectionWaypointFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
