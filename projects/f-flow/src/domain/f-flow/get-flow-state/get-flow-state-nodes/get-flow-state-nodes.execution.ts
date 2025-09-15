import { inject, Injectable } from '@angular/core';
import { GetFlowStateNodesRequest } from './get-flow-state-nodes-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IFFlowStateNode } from '../i-f-flow-state-node';
import { FComponentsStore } from '../../../../f-storage';
import { IFFlowStateConnector } from '../i-f-flow-state-connector';

/**
 * Execution that retrieves the state of Flow nodes, including their position, size, inputs, outputs, and selection status.
 */
@Injectable()
@FExecutionRegister(GetFlowStateNodesRequest)
export class GetFlowStateNodesExecution
  implements IExecution<GetFlowStateNodesRequest, IFFlowStateNode[]>
{
  private readonly _store = inject(FComponentsStore);

  public handle(request: GetFlowStateNodesRequest): IFFlowStateNode[] {
    return this._store.fNodes
      .filter((x) => x instanceof request.type)
      .map((x) => {
        return {
          id: x.fId(),
          parent: x.fParentId(),
          position: x._position,
          size: x._size,
          rotate: x._rotate,
          fOutputs: this._getOutputs(x.hostElement),
          fInputs: this._getInputs(x.hostElement),
          isSelected: x.isSelected(),
        };
      });
  }

  private _getOutputs(hostElement: HTMLElement): IFFlowStateConnector[] {
    return this._store.fOutputs
      .filter((x) => hostElement.contains(x.hostElement))
      .map((x) => {
        return {
          id: x.fId(),
          fConnectableSide: x.fConnectableSide,
        };
      });
  }

  private _getInputs(hostElement: HTMLElement): IFFlowStateConnector[] {
    return this._store.fInputs
      .filter((x) => hostElement.contains(x.hostElement))
      .map((x) => {
        return {
          id: x.fId(),
          fConnectableSide: x.fConnectableSide,
        };
      });
  }
}
