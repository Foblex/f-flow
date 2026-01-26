import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  model,
  numberAttribute,
  OnDestroy,
  OnInit,
  untracked,
} from '@angular/core';
import { F_CONNECTION_WAYPOINTS, FConnectionWaypointsBase } from './models';
import { IPoint } from '@foblex/2d';
import { NotifyDataChangedRequest } from '../../../f-storage';
import { FMediator } from '@foblex/mediator';
import { F_CONNECTION_COMPONENTS_PARENT } from '../../models';
import { RemoveConnectionWaypointRequest } from '../../../domain';

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
export class FConnectionWaypoints extends FConnectionWaypointsBase implements OnInit, OnDestroy {
  private readonly _mediator = inject(FMediator);
  private readonly _injector = inject(Injector);
  private readonly _connection = inject(F_CONNECTION_COMPONENTS_PARENT);

  public override readonly radius = input(4, {
    transform: numberAttribute,
  });
  public override readonly waypoints = model<IPoint[]>([]);

  public override readonly visibility = input(true, {
    transform: booleanAttribute,
  });

  public ngOnInit(): void {
    this._listenChanges();
  }

  private _listenChanges(): void {
    effect(
      () => {
        this.radius();
        this.waypoints();
        this.visibility();
        untracked(() => this._notifyDataChanged());
      },
      { injector: this._injector },
    );
  }

  private _notifyDataChanged(): void {
    this._mediator.execute(new NotifyDataChangedRequest());
  }

  protected remove(index: number, event: MouseEvent): void {
    this._mediator.execute(new RemoveConnectionWaypointRequest(index, this._connection.fId()));
    event.stopPropagation();
    event.preventDefault();
  }

  public ngOnDestroy(): void {
    this._notifyDataChanged();
  }
}
