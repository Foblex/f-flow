import { IHandler } from '@foblex/mediator';
import { IGroupViewModel } from '../i-group-view-model';
import { IDatabaseStorage } from '../../database.storage';

export class ToGroupViewModelHandler implements IHandler<void, IGroupViewModel[]> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(): IGroupViewModel[] {
    return this.storage.groups.map((x) => {
      return {
        ...x,
      };
    });
  }
}
