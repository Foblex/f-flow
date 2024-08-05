import { IFlowStorage } from '../../flow.storage';
import { IHandler } from '@foblex/core';
import { IFlowConnectionViewModel } from '../i-flow-connection-view-model';
import { IFlowConnectionStorageModel } from '../i-flow-connection-storage-model';
import { IFlowNodeStorageModel } from '../../node/i-flow-node-storage-model';
import { NODE_CONFIGURATION } from '../../configuration';

export class MapToConnectionViewModelHandler implements IHandler<void, IFlowConnectionViewModel[]>{

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(): IFlowConnectionViewModel[] {
    return this.getConnections().map((x) => {
      return this.mapConnection(x, this.getFromNode(x), this.getToNode(x));
    });
  }

  private getConnections(): IFlowConnectionStorageModel[] {
    return this.flow.connections;
  }

  private mapConnection(
    connection: IFlowConnectionStorageModel, fromNode: IFlowNodeStorageModel, toNode: IFlowNodeStorageModel
  ): IFlowConnectionViewModel {
    return {
      ...connection,
      color1: NODE_CONFIGURATION[ fromNode.type ].color,
      color2: NODE_CONFIGURATION[ toNode.type ].color,
      text: NODE_CONFIGURATION[ fromNode.type ].text,
    };
  }

  private getFromNode(connection: IFlowConnectionStorageModel): IFlowNodeStorageModel {
    const result = this.getNodes().find((node) => node.output === connection.from);
    if (!result) {
      throw new Error('From node not found');
    }
    return result;
  }

  private getToNode(connection: IFlowConnectionStorageModel): IFlowNodeStorageModel {
    const result = this.getNodes().find((node) => node.input === connection.to);
    if (!result) {
      throw new Error('To node not found');
    }
    return result;
  }

  private getNodes(): IFlowNodeStorageModel[] {
    return this.flow.nodes;
  }
}
