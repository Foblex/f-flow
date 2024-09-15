import { IHandler } from '@foblex/mediator';
import { CreateConnectionRequest } from './create-connection.request';
import { IDatabaseStorage } from '../../database.storage';
import { generateGuid } from '@foblex/utils';

export class CreateConnectionHandler implements IHandler<CreateConnectionRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: CreateConnectionRequest): void {
    this.getConnection(request.outputId, request.inputId);

    this.storage.connections.push({
      id: generateGuid(),
      from: request.outputId,
      to: request.inputId,
      type: request.type
    });
  }

  private getConnection(from: string, to: string): void {
    const result = this.storage.connections.find((x) => {
      return x.from === from && x.to === to;
    });
    if (result) {
      throw new Error(`Connection from ${ from } to ${ to } already exists`);
    }
  }
}
