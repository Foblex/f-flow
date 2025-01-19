import { inject, Injectable } from '@angular/core';
import { GetFlowStateConnectionsRequest } from './get-flow-state-connections-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../f-storage';
import { IFFlowStateConnection } from '../i-f-flow-state-connection';
import { FConnectionBase } from '../../../../f-connection';

@Injectable()
@FExecutionRegister(GetFlowStateConnectionsRequest)
export class GetFlowStateConnectionsExecution implements IExecution<GetFlowStateConnectionsRequest, IFFlowStateConnection[]> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: GetFlowStateConnectionsRequest): IFFlowStateConnection[] {
    return this._fComponentsStore.fConnections.map(this._mapToConnectionState);
  }

  private _mapToConnectionState(x: FConnectionBase): IFFlowStateConnection {
    return {
      id: x.fId,
      fOutputId: x.fOutputId,
      fInputId: x.fInputId,
      fType: x.fType,
      fBehavior: x.fBehavior,
      isSelected: x.isSelected()
    }
  }
}
