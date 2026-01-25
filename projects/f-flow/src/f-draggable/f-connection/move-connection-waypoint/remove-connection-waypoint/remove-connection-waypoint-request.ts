import { FConnectionBase, WaypointPick } from '../../../../f-connection-v2';

export class RemoveConnectionWaypointRequest {
  static readonly fToken = Symbol('RemoveConnectionWaypointRequest');
  constructor(public readonly pick: WaypointPick<FConnectionBase>) {}
}
