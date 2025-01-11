import { Injectable } from '@angular/core';
import { GetFlowStateConnectionsRequest } from './get-flow-state-connections-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../f-storage';
import { IFFlowStateConnection } from '../i-f-flow-state-connection';

@Injectable()
@FExecutionRegister(GetFlowStateConnectionsRequest)
export class GetFlowStateConnectionsExecution implements IExecution<GetFlowStateConnectionsRequest, IFFlowStateConnection[]> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetFlowStateConnectionsRequest): IFFlowStateConnection[] {
    return this.fComponentsStore.fConnections.map((x) => {
      return {
        id: x.fId,
        fOutputId: x.fOutputId,
        fInputId: x.fInputId,
        fType: x.fType,
        fBehavior: x.fBehavior,
        isSelected: x.isSelected()
      }
    });
  }
}
