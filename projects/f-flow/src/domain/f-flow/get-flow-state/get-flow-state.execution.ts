import { GetFlowStateRequest } from './get-flow-state.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IFFlowState } from './i-f-flow-state';
import { FComponentsStore } from '../../../f-storage';
import { FGroupDirective, FNodeDirective } from '../../../f-node';
import { IPoint, ITransformModel, PointExtensions } from '@foblex/2d';
import { GetFlowStateNodesRequest } from './get-flow-state-nodes';
import { GetFlowStateConnectionsRequest } from './get-flow-state-connections';

@Injectable()
@FExecutionRegister(GetFlowStateRequest)
export class GetFlowStateExecution implements IExecution<GetFlowStateRequest, IFFlowState> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(payload: GetFlowStateRequest): IFFlowState {
    return {
      position: this._getCanvasPosition(this._fComponentsStore.fCanvas!.transform),
      scale: this._fComponentsStore.fCanvas!.transform.scale,
      nodes: this._fMediator.execute(new GetFlowStateNodesRequest(FNodeDirective)),
      groups: this._fMediator.execute(new GetFlowStateNodesRequest(FGroupDirective)),
      connections: this._fMediator.execute(new GetFlowStateConnectionsRequest())
    }
  }

  private _getCanvasPosition(transform: ITransformModel): IPoint {
    return PointExtensions.sum(transform.position, transform.scaledPosition);
  }
}



