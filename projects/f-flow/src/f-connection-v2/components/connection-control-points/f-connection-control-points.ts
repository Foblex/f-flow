import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { F_CONNECTION_CONTROL_POINTS, FConnectionControlPointsBase } from './models';
import { IPoint } from '@foblex/2d';

@Component({
  selector: 'f-connection-control-points',
  templateUrl: './f-connection-control-points.html',
  styleUrls: ['./f-connection-control-points.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection-control-points',
  },
  providers: [{ provide: F_CONNECTION_CONTROL_POINTS, useExisting: FConnectionControlPoints }],
})
export class FConnectionControlPoints extends FConnectionControlPointsBase {
  public override readonly radius = input<number>(4);
  public override readonly pivots = model<IPoint[]>([]);
}
