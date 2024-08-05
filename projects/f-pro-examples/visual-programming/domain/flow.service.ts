import { Injectable } from '@angular/core';
import { FLOW_STORAGE, IFlowStorage } from './flow.storage';
import { MapToNodeViewModelHandler } from './node/map/map-to-node-view-model.handler';
import { MapToConnectionViewModelHandler } from './connection/map/map-to-connection-view-model.handler';
import { IPoint } from '@foblex/core';
import { MoveNodeHandler } from './node/move-nodes/move-node.handler';
import { MoveNodeRequest } from './node/move-nodes/move-node.request';
import { AddNewNodeToFlowHandler } from './node/add-new/add-new-node-to-flow.handler';
import { AddNewNodeToFlowRequest } from './node/add-new/add-new-node-to-flow.request';
import { ENodeType } from './e-node-type';
import { IFlowViewModel } from './i-flow-view-model';
import { ReassignConnectionHandler } from './connection/reassign/reassign-connection.handler';
import { ReassignConnectionRequest } from './connection/reassign/reassign-connection.request';
import { CreateConnectionRequest } from './connection/add-new/create-connection.request';
import { CreateConnectionHandler } from './connection/add-new/create-connection.handler';

@Injectable()
export class FlowService {

  private flow: IFlowStorage = FLOW_STORAGE;

  public getFlow(): IFlowViewModel {
    return {
      nodes: new MapToNodeViewModelHandler(this.flow).handle(),
      connections: new MapToConnectionViewModelHandler(this.flow).handle(),
    }
  }

  public addNode(type: ENodeType, position: IPoint): void {
    new AddNewNodeToFlowHandler(this.flow).handle(
      new AddNewNodeToFlowRequest(type, position)
    );
  }

  public moveNode(id: string, position: IPoint): void {
    new MoveNodeHandler(this.flow).handle(
      new MoveNodeRequest(id, position)
    );
  }

  public addConnection(outputId: string, inputId: string): void {
    new CreateConnectionHandler(this.flow).handle(
      new CreateConnectionRequest(outputId, inputId)
    );
  }

  public reassignConnection(outputId: string, oldInputId: string, newInputId: string): void {
    new ReassignConnectionHandler(this.flow).handle(
      new ReassignConnectionRequest(outputId, oldInputId, newInputId)
    );
  }
}
