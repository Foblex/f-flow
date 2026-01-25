import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  numberAttribute,
} from '@angular/core';
import { F_CONNECTION_WAYPOINTS, FConnectionWaypointsBase } from './models';
import { IPoint } from '@foblex/2d';

@Component({
  selector: 'f-connection-waypoints',
  templateUrl: './f-connection-waypoints.html',
  styleUrls: ['./f-connection-waypoints.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection-waypoints',
  },
  providers: [{ provide: F_CONNECTION_WAYPOINTS, useExisting: FConnectionWaypoints }],
})
export class FConnectionWaypoints extends FConnectionWaypointsBase {
  public override readonly radius = input(4, {
    transform: numberAttribute,
  });
  public override readonly waypoints = model<IPoint[]>([]);

  public override readonly visibility = input(true, {
    transform: booleanAttribute,
  });
}
