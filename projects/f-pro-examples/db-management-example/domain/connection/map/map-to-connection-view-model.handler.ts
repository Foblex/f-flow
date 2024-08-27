import { IFlowStorage } from '../../flow.storage';
import { IHandler } from '@foblex/core';
import { IFlowConnectionViewModel } from '../i-flow-connection-view-model';
import { IFlowConnectionStorageModel } from '../i-flow-connection-storage-model';
import { IFlowNodeStorageModel } from '../../node/i-flow-node-storage-model';

export class MapToConnectionViewModelHandler implements IHandler<void, IFlowConnectionViewModel[]>{

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(): IFlowConnectionViewModel[] {
    return this.getConnections().map((x) => {
      return {
        ...x
      };
    });
  }

  private getConnections(): IFlowConnectionStorageModel[] {
    return this.flow.connections;
  }

  private getNodes(): IFlowNodeStorageModel[] {
    return this.flow.nodes;
  }
}
