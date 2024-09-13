import { IHandler } from '@foblex/mediator';
import { ChangeColumnKeyRequest } from './change-column-key.request';
import { IDatabaseStorage } from '../../database.storage';
import { ITableStorageModel } from '../i-table-storage-model';
import { ITableColumn } from '../i-table-column';

export class ChangeColumnKeyHandler implements IHandler<ChangeColumnKeyRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: ChangeColumnKeyRequest): void {
    const table = this.findTable(request.tableId);
    const column = this.findColumn(table, request.columnId);
    column.key = request.key || undefined;
  }

  private findTable(id: string): ITableStorageModel {
    const result = this.storage.tables.find((x) => x.id === id);
    if (!result) {
      throw new Error(`Table with id ${ id } not found`);
    }
    return result;
  }

  private findColumn(table: ITableStorageModel, id: string): ITableColumn {
    const result = table.columns.find((x) => x.id === id);
    if (!result) {
      throw new Error(`Column with id ${ id } not found`);
    }
    return result;
  }
}
