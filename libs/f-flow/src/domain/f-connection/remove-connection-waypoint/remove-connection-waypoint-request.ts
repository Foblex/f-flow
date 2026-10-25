export class RemoveConnectionWaypointRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RemoveConnectionWaypointRequest');
  constructor(
    public readonly waypointIndex: number,
    public readonly connectionId: string,
  ) {}
}
