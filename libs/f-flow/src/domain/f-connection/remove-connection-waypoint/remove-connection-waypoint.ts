import { inject, Injectable } from '@angular/core';
import { RemoveConnectionWaypointRequest } from './remove-connection-waypoint-request';
import { IExecution } from '../../../_libs/f-mediator';
import { FComponentsStore } from '../../../f-storage';
import { FConnectionBase } from '../../../f-connection-v2';
import { FConnectionWaypointsChangedEvent } from '../../../f-draggable';

@Injectable()
export class RemoveConnectionWaypoint implements IExecution<RemoveConnectionWaypointRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ waypointIndex, connectionId }: RemoveConnectionWaypointRequest): void {
    const connection = this._store.connections.require(connectionId);

    const current = connection.fWaypoints()?.waypoints().slice();
    if (!current) {
      throw new Error('Connection waypoints not found');
    }
    current.splice(waypointIndex, 1);

    connection.fWaypoints()?.waypoints.set(current);

    this._store.fDraggable?.fConnectionWaypointsChanged.emit(this._changeEvent(connection));
  }

  private _changeEvent(connection: FConnectionBase): FConnectionWaypointsChangedEvent {
    return new FConnectionWaypointsChangedEvent(
      connection.fId(),
      connection.fWaypoints()?.waypoints() || [],
    );
  }
}
