import { IPoint, PointExtensions } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { DragHandlerBase } from '../../../infrastructure';
import { FComponentsStore } from '../../../../f-storage';
import {
  FConnectionBase,
  FConnectionWaypointsBase,
  FConnectionWaypointsChangedEvent,
  WaypointPick,
} from '../../../../f-connection-v2';

@Injectable()
export class DragConnectionWaypointHandler extends DragHandlerBase<unknown> {
  protected readonly type = 'move-connection-waypoint';
  protected readonly kind = 'drag-connection-waypoint';

  private readonly _store = inject(FComponentsStore);

  private _point: IPoint | undefined;
  private _pick: WaypointPick<FConnectionBase> | undefined;

  private get _waypointsComponent(): FConnectionWaypointsBase {
    return this._pick?.connection.fWaypoints() as FConnectionWaypointsBase;
  }

  private get _connection(): FConnectionBase {
    return this._pick?.connection as FConnectionBase;
  }

  public setPick(pick: WaypointPick<FConnectionBase>): void {
    this._pick = pick;
  }

  public override prepareDragSequence(): void {
    if (this._pick?.candidate) {
      this._point = { ...this._pick.candidate };
      this._waypointsComponent.insert(this._pick.candidate);
    } else if (this._pick?.waypoint) {
      this._point = { ...this._pick.waypoint };
      this._waypointsComponent.select(this._pick.waypoint);
    }
    this._redrawConnection();
  }

  public onPointerMove(_difference: IPoint): void {
    this._waypointsComponent.move(PointExtensions.sum(this._point!, _difference));
    this._redrawConnection();
  }

  public override onPointerUp(): void {
    this._waypointsComponent.update();
    this._store.fDraggable?.fConnectionWaypointsChanged.emit(this._eventFromPick());
  }

  private _redrawConnection(): void {
    this._connection.setLine(this._connection.line);
    this._connection.redraw();
  }

  private _eventFromPick(): FConnectionWaypointsChangedEvent {
    return new FConnectionWaypointsChangedEvent(
      this._connection.fId(),
      this._connection.fWaypoints()?.waypoints() || [],
    );
  }
}
