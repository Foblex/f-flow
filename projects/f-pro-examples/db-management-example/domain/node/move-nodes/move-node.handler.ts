import { IHandler } from '@foblex/core';
import { MoveNodeRequest } from './move-node.request';
import { IFlowStorage } from '../../flow.storage';

export class MoveNodeHandler implements IHandler<MoveNodeRequest> {

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(request: MoveNodeRequest): void {
    const node = this.flow.nodes.find((x) => x.id === request.id);
    if (!node) {
      throw new Error(`Node with id ${ request.id } not found`);
    }
    node.position = request.position;
  }
}
