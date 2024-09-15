import { IHandler } from '@foblex/mediator';
import { ITableViewModel } from '../i-table-view-model';
import { IDatabaseStorage } from '../../database.storage';

export class ToTableViewModelHandler implements IHandler<void, ITableViewModel[]> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(): ITableViewModel[] {
    return this.storage.tables.map((x) => {
      return {
        ...x,
        columns: x.columns.map((c) => ({ ...c }))
      };
    });
  }
}
