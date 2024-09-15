import { IHandler } from '@foblex/mediator';
import { RemoveTableRequest } from './remove-table.request';
import { IDatabaseStorage } from '../../database.storage';
import { ITableStorageModel } from '../i-table-storage-model';
import { ITableConnectionStorageModel } from '../../connection';

export class RemoveTableHandler implements IHandler<RemoveTableRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: RemoveTableRequest): void {
    const index = this.findTableIndex(request.tableId);
    this.removeOutgoingConnections(this.storage.tables[index]);
    this.removeIncomingConnections(this.storage.tables[index]);
    this.storage.tables.splice(index, 1);
  }

  private findTableIndex(id: string): number {
    const index = this.storage.tables.findIndex((x) => x.id === id);
    if (index === -1) {
      throw new Error(`Table with id ${ id } not found`);
    }
    return index;
  }

  private removeOutgoingConnections(table: ITableStorageModel): void {
    table.columns.forEach((column) => {
      const connections = this.storage.connections.filter((x) => x.from === column.id);
      this.removeConnections(connections);
    });
  }

  private removeIncomingConnections(table: ITableStorageModel): void {
    table.columns.forEach((column) => {
      const connections = this.storage.connections.filter((x) => x.to === column.id);
      this.removeConnections(connections);
    });
  }

  private removeConnections(connections: ITableConnectionStorageModel[]): void {
    connections.forEach((connection) => {
      const index = this.storage.connections.findIndex((x) => x.id === connection.id);
      this.storage.connections.splice(index, 1);
    });
  }
}
