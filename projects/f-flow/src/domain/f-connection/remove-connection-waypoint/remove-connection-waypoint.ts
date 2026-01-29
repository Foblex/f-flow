import { inject, Injectable } from '@angular/core';
import { RemoveConnectionWaypointRequest } from './remove-connection-waypoint-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FConnectionBase, FConnectionWaypointsChangedEvent } from '../../../f-connection-v2';

@Injectable()
@FExecutionRegister(RemoveConnectionWaypointRequest)
export class RemoveConnectionWaypoint implements IExecution<RemoveConnectionWaypointRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ waypointIndex, connectionId }: RemoveConnectionWaypointRequest): void {
    const connection = this._findConnection(connectionId);

    const current = connection.fWaypoints()?.waypoints().slice();
    if (!current) {
      throw new Error('Connection waypoints not found');
    }
    current.splice(waypointIndex, 1);

    connection.fWaypoints()?.waypoints.set(current);

    this._store.fDraggable?.fConnectionWaypointsChanged.emit(this._changeEvent(connection));
  }

  private _findConnection(id: string): FConnectionBase {
    const result = this._store.connections.getAll<FConnectionBase>().find((x) => x.fId() === id);
    if (!result) {
      throw new Error(`Cannot find connection with id ${id}`);
    }

    return result;
  }

  private _changeEvent(connection: FConnectionBase): FConnectionWaypointsChangedEvent {
    return new FConnectionWaypointsChangedEvent(
      connection.fId(),
      connection.fWaypoints()?.waypoints() || [],
    );
  }
}
