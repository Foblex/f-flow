import { inject, Injectable } from '@angular/core';
import { RemoveConnectionWaypointRequest } from './remove-connection-waypoint-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../f-storage';
import {
  FConnectionBase,
  FConnectionWaypointsChangedEvent,
  WaypointPick,
} from '../../../../f-connection-v2';

@Injectable()
@FExecutionRegister(RemoveConnectionWaypointRequest)
export class RemoveConnectionWaypoint implements IExecution<RemoveConnectionWaypointRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ pick }: RemoveConnectionWaypointRequest): void {
    if (pick.waypoint) {
      pick.connection.fWaypoints()?.remove(pick.waypoint);
      this._redrawConnection(pick.connection);
      this._store.fDraggable?.fConnectionWaypointsChanged.emit(this._eventFromPick(pick));
    }
  }

  private _redrawConnection(connection: FConnectionBase): void {
    connection.setLine(connection.line);
    connection.redraw();
  }

  private _eventFromPick({
    connection,
  }: WaypointPick<FConnectionBase>): FConnectionWaypointsChangedEvent {
    return new FConnectionWaypointsChangedEvent(
      connection.fId(),
      connection.fWaypoints()?.waypoints() || [],
    );
  }
}
