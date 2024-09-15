import { GetFlowStateRequest } from './get-flow-state.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IFFlowState } from './i-f-flow-state';
import { FComponentsStore } from '../../f-storage';
import { FGroupDirective, FNodeDirective } from '../../f-node';
import { IPoint, ITransformModel, PointExtensions } from '@foblex/2d';
import { GetFlowStateNodesRequest } from './get-flow-state-nodes';
import { GetFlowStateConnectionsRequest } from './get-flow-state-connections';

@Injectable()
@FExecutionRegister(GetFlowStateRequest)
export class GetFlowStateExecution implements IExecution<GetFlowStateRequest, IFFlowState> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator
  ) {
  }

  public handle(payload: GetFlowStateRequest): IFFlowState {
    return {
      position: this.getCanvasPosition(this.fComponentsStore.fCanvas!.transform),
      scale: this.fComponentsStore.fCanvas!.transform.scale,
      nodes: this.fMediator.send(new GetFlowStateNodesRequest(FNodeDirective)),
      groups: this.fMediator.send(new GetFlowStateNodesRequest(FGroupDirective)),
      connections: this.fMediator.send(new GetFlowStateConnectionsRequest())
    }
  }

  private getCanvasPosition(transform: ITransformModel): IPoint {
    return PointExtensions.sum(transform.position, transform.scaledPosition);
  }
}



