import { IHandler } from '@foblex/mediator';
import { ITableConnectionViewModel } from '../i-table-connection-view-model';
import { IDatabaseStorage } from '../../database.storage';

export class ToConnectionViewModelHandler implements IHandler<void, ITableConnectionViewModel[]>{

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(): ITableConnectionViewModel[] {
    return this.storage.connections.map((x) => {
      return {
        ...x
      };
    });
  }
}
