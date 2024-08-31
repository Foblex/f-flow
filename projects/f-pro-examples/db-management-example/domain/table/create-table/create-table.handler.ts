import { GuidExtensions, IHandler } from '@foblex/core';
import { CreateTableRequest } from './create-table.request';
import { IDatabaseStorage } from '../../database.storage';
import { ETableColumnType } from '../e-table-column-type';

export class CreateTableHandler implements IHandler<CreateTableRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: CreateTableRequest): void {
    this.storage.tables.push({
      id: GuidExtensions.generate(),
      name: 'table_' + (this.storage.tables.length + 1),
      position: request.position,
      columns: [
        {
          id: GuidExtensions.generate(),
          name: 'id',
          type: ETableColumnType.INT,
        }
      ],
    });
  }
}
