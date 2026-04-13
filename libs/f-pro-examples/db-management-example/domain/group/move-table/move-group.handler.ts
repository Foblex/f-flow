import { IHandler } from '@foblex/mediator';
import { MoveGroupRequest } from './move-group.request';
import { IDatabaseStorage } from '../../database.storage';

export class MoveGroupHandler implements IHandler<MoveGroupRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: MoveGroupRequest): void {
    const node = this.storage.groups.find((x) => x.id === request.id);
    if (!node) {
      throw new Error(`Group with id ${ request.id } not found`);
    }
    node.position = request.position;
  }
}
