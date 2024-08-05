import { IHandler } from '@foblex/core';
import { ReassignConnectionRequest } from './reassign-connection.request';
import { IFlowStorage } from '../../flow.storage';
import { IFlowConnectionStorageModel } from '../i-flow-connection-storage-model';

export class ReassignConnectionHandler implements IHandler<ReassignConnectionRequest> {

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(request: ReassignConnectionRequest): void {
    const index = this.getConnectionIndex(request);
    if (index === -1) {
      throw new Error('Connection not found');
    }

    this.flow.connections.splice(index, 1,
      this.createConnection(request.outputId, request.newInputId)
    );
  }

  private getConnectionIndex(request: ReassignConnectionRequest): number {
    return this.flow.connections.findIndex((x) => {
      return x.from === request.outputId && x.to === request.oldInputId;
    });
  }

  private createConnection(outputId: string, inputId: string): IFlowConnectionStorageModel {
    return {
      from: outputId,
      to: inputId,
    };
  }
}
