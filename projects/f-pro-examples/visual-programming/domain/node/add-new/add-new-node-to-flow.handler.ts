import { GuidExtensions } from '@foblex/core';
import { IHandler } from '@foblex/mediator';
import { AddNewNodeToFlowRequest } from './add-new-node-to-flow.request';
import { IFlowStorage } from '../../flow.storage';

export class AddNewNodeToFlowHandler implements IHandler<AddNewNodeToFlowRequest> {

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(request: AddNewNodeToFlowRequest): void {
    this.flow.nodes.push({
      id: GuidExtensions.generate(),
      input: GuidExtensions.generate(),
      output: GuidExtensions.generate(),
      type: request.type,
      position: request.position,
    });
  }
}
