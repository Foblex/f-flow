import { IPoint } from '../../../_libs/f-2d';

export class FConnectionWaypointsChangedEvent {
  constructor(
    public readonly connectionId: string,
    public readonly waypoints: IPoint[],
  ) {}
}
