import { IPoint } from '@foblex/2d';

export class FConnectionWaypointsChangedEvent {
  constructor(
    public readonly connectionId: string,
    public readonly waypoints: IPoint[],
  ) {}
}
