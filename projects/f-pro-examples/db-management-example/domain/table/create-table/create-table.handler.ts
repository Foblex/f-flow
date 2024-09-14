import { IHandler } from '@foblex/mediator';
import { CreateTableRequest } from './create-table.request';
import { IDatabaseStorage } from '../../database.storage';
import { ETableColumnType } from '../e-table-column-type';
import { generateGuid } from '@foblex/utils';

export class CreateTableHandler implements IHandler<CreateTableRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: CreateTableRequest): void {
    this.storage.tables.push({
      id: generateGuid(),
      name: 'table_' + (this.storage.tables.length + 1),
      position: request.position,
      columns: [
        {
          id: generateGuid(),
          name: 'id',
          type: ETableColumnType.INT,
        }
      ],
    });
  }
}
