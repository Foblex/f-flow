import { inject, Injectable } from '@angular/core';
import { CalculateConnectionsStateRequest } from './calculate-connections-state-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../f-storage';
import { IFFlowStateConnection } from '../i-f-flow-state-connection';
import { FConnectionBase } from '../../../../f-connection-v2';

/**
 * Execution that retrieves the current Flow state connections from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(CalculateConnectionsStateRequest)
export class CalculateConnectionsState
  implements IExecution<CalculateConnectionsStateRequest, IFFlowStateConnection[]>
{
  private readonly _store = inject(FComponentsStore);

  public handle(_request: CalculateConnectionsStateRequest): IFFlowStateConnection[] {
    return this._store.fConnections.map(this._mapToConnectionState);
  }

  private _mapToConnectionState(x: FConnectionBase): IFFlowStateConnection {
    return {
      id: x.fId(),
      fOutputId: x.fOutputId(),
      fInputId: x.fInputId(),
      fType: x.fType,
      fBehavior: x.fBehavior,
      isSelected: x.isSelected(),
      waypoints: x.fWaypoints()?.waypoints() || [],
      fInputSide: x.fInputSide(),
      fOutputSide: x.fOutputSide(),
    };
  }
}
