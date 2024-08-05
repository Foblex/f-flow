import { IHandler } from '@foblex/core';
import { CreateConnectionRequest } from './create-connection.request';
import { IFlowStorage } from '../../flow.storage';
import { IFlowConnectionStorageModel } from '../i-flow-connection-storage-model';

export class CreateConnectionHandler implements IHandler<CreateConnectionRequest> {

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(request: CreateConnectionRequest): void {
    const index = this.getConnectionIndex(request);
    if (index > -1) {
      throw new Error('Connection already exists');
    }

    this.flow.connections.push(
      this.createConnection(request.outputId, request.inputId)
    );
  }

  private getConnectionIndex(request: CreateConnectionRequest): number {
    return this.flow.connections.findIndex((x) => {
      return x.from === request.outputId && x.to === request.inputId;
    });
  }

  private createConnection(outputId: string, inputId: string): IFlowConnectionStorageModel {
    return {
      from: outputId,
      to: inputId,
    };
  }
}
