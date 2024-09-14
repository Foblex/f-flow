import { IHandler } from '@foblex/mediator';
import { AddNewNodeToFlowRequest } from './add-new-node-to-flow.request';
import { IFlowStorage } from '../../flow.storage';
import { generateGuid } from '@foblex/utils';

export class AddNewNodeToFlowHandler implements IHandler<AddNewNodeToFlowRequest> {

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(request: AddNewNodeToFlowRequest): void {
    this.flow.nodes.push({
      id: generateGuid(),
      input: generateGuid(),
      output: generateGuid(),
      type: request.type,
      position: request.position,
    });
  }
}
