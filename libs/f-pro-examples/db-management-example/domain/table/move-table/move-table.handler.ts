import { IHandler } from '@foblex/mediator';
import { MoveTableRequest } from './move-table.request';
import { IDatabaseStorage } from '../../database.storage';

export class MoveTableHandler implements IHandler<MoveTableRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: MoveTableRequest): void {
    const node = this.storage.tables.find((x) => x.id === request.id);
    if (!node) {
      throw new Error(`Table with id ${ request.id } not found`);
    }
    node.position = request.position;
  }
}
