import { IHandler } from '@foblex/mediator';
import { ChangeConnectionTypeRequest } from './change-connection-type.request';
import { ITableConnectionStorageModel } from '../i-table-connection-storage-model';
import { IDatabaseStorage } from '../../database.storage';

export class ChangeConnectionTypeHandler implements IHandler<ChangeConnectionTypeRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: ChangeConnectionTypeRequest): void {
    const connection = this.getConnection(request.id);
    connection.type = request.type;
  }

  private getConnection(id: string): ITableConnectionStorageModel {
    const result = this.storage.connections.find((x) => x.id === id);
    if (!result) {
      throw new Error(`Connection with id ${ id } not found`);
    }
    return result;
  }
}
