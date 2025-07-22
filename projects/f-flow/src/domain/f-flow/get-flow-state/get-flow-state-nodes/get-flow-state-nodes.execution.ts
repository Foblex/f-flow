import { Injectable } from '@angular/core';
import { GetFlowStateNodesRequest } from './get-flow-state-nodes-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IFFlowStateNode } from '../i-f-flow-state-node';
import { FComponentsStore } from '../../../../f-storage';
import { IFFlowStateConnector } from '../i-f-flow-state-connector';

@Injectable()
@FExecutionRegister(GetFlowStateNodesRequest)
export class GetFlowStateNodesExecution implements IExecution<GetFlowStateNodesRequest, IFFlowStateNode[]> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetFlowStateNodesRequest): IFFlowStateNode[] {
    return this.fComponentsStore.fNodes.filter((x) => x instanceof request.type).map((x) => {
      return {
        id: x.fId(),
        parent: x.fParentId,
        position: x.position,
        size: x.size,
        fOutputs: this._getOutputs(x.hostElement),
        fInputs: this._getInputs(x.hostElement),
        isSelected: x.isSelected()
      };
    });
  }

  private _getOutputs(hostElement: HTMLElement): IFFlowStateConnector[] {
    return this.fComponentsStore.fOutputs.filter((x) => hostElement.contains(x.hostElement)).map((x) => {
      return {
        id: x.fId,
        fConnectableSide: x.fConnectableSide
      }
    });
  }

  private _getInputs(hostElement: HTMLElement): IFFlowStateConnector[] {
    return this.fComponentsStore.fInputs.filter((x) => hostElement.contains(x.hostElement)).map((x) => {
      return {
        id: x.fId,
        fConnectableSide: x.fConnectableSide
      }
    });
  }
}
