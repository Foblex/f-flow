export class RemoveConnectionWaypointRequest {
  static readonly fToken = Symbol('RemoveConnectionWaypointRequest');
  constructor(
    public readonly waypointIndex: number,
    public readonly connectionId: string,
  ) {}
}
