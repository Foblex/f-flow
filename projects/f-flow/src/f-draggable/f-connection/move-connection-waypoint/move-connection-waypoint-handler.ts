import { IPoint, PointExtensions } from '@foblex/2d';
import { Injector } from '@angular/core';
import { FDragHandlerBase } from '../../../f-draggable';
import {
  FConnectionBase,
  FConnectionWaypointsBase,
  FConnectionWaypointsChangedEvent,
  WaypointPick,
} from '../../../f-connection-v2';
import { FComponentsStore } from '../../../f-storage';

export class MoveConnectionWaypointHandler extends FDragHandlerBase<unknown> {
  protected readonly type = 'move-connection-waypoint';

  private readonly _store: FComponentsStore;

  private _point: IPoint | undefined;

  private get _waypointsComponent(): FConnectionWaypointsBase {
    return this._pick.connection.fWaypoints() as FConnectionWaypointsBase;
  }

  private get _connection(): FConnectionBase {
    return this._pick.connection;
  }

  constructor(
    readonly _injector: Injector,
    private readonly _pick: WaypointPick<FConnectionBase>,
  ) {
    super();
    this._store = this._injector.get(FComponentsStore);
  }

  public override prepareDragSequence(): void {
    if (this._pick.candidate) {
      this._point = { ...this._pick.candidate };
      this._waypointsComponent.insert(this._pick.candidate);
    } else {
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
      this._pick.connection.fId(),
      this._pick.connection.fWaypoints()?.waypoints() || [],
    );
  }
}
