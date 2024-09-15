import { IHandler } from '@foblex/mediator';
import { RemoveColumnRequest } from './remove-column.request';
import { IDatabaseStorage } from '../../database.storage';
import { ITableStorageModel } from '../i-table-storage-model';
import { ITableConnectionStorageModel } from '../../connection';
import { ITableColumn } from '../i-table-column';

export class RemoveColumnHandler implements IHandler<RemoveColumnRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: RemoveColumnRequest): void {
    const table = this.findTable(request.tableId);
    const index = this.findColumnIndex(table, request.columnId);
    this.removeOutgoingConnections(table.columns[index]);
    this.removeIncomingConnections(table.columns[index]);
    table.columns.splice(index, 1);
  }

  private findTable(id: string): ITableStorageModel {
    const result = this.storage.tables.find((x) => x.id === id);
    if (!result) {
      throw new Error(`Table with id ${ id } not found`);
    }
    return result;
  }

  private findColumnIndex(table: ITableStorageModel, id: string): number {
    const index = table.columns.findIndex((x) => x.id === id);
    if (index === -1) {
      throw new Error(`Column with id ${ id } not found`);
    }
    return index;
  }

  private removeOutgoingConnections(column: ITableColumn): void {
    const connections = this.storage.connections.filter((x) => x.from === column.id);
    this.removeConnections(connections);
  }

  private removeIncomingConnections(column: ITableColumn): void {
    const connections = this.storage.connections.filter((x) => x.to === column.id);
    this.removeConnections(connections);
  }

  private removeConnections(connections: ITableConnectionStorageModel[]): void {
    connections.forEach((connection) => {
      const index = this.storage.connections.findIndex((x) => x.id === connection.id);
      this.storage.connections.splice(index, 1);
    });
  }
}
