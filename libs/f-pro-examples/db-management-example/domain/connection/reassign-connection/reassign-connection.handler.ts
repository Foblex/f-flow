import { IHandler } from '@foblex/mediator';
import { ReassignConnectionRequest } from './reassign-connection.request';
import { ITableConnectionStorageModel } from '../i-table-connection-storage-model';
import { IDatabaseStorage } from '../../database.storage';

export class ReassignConnectionHandler implements IHandler<ReassignConnectionRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: ReassignConnectionRequest): void {
    const connection = this.getConnection(request.id);
    connection.to = request.inputId;
  }

  private getConnection(id: string): ITableConnectionStorageModel {
    const result = this.storage.connections.find((x) => x.id === id);
    if (!result) {
      throw new Error(`Connection with id ${ id } not found`);
    }
    return result;
  }
}
