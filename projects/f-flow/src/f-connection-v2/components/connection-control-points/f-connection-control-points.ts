import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  F_CONNECTION_CONTROL_POINTS,
  FConnectionControlPointsBase,
  IControlPointCandidate,
} from './models';

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
  public override readonly candidates = signal<IControlPointCandidate[]>([]);

  public override readonly radius = signal<number>(4);
}
