import { IHandler } from '@foblex/core';
import { IFlowNodeViewModel } from '../i-flow-node-view-model';
import { IFlowStorage } from '../../flow.storage';
import { NODE_CONFIGURATION } from '../../configuration';

export class MapToNodeViewModelHandler implements IHandler<void, IFlowNodeViewModel[]> {

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(): IFlowNodeViewModel[] {
    return this.flow.nodes.map((node) => {
      return {
        ...node,
        color: NODE_CONFIGURATION[ node.type ].color,
      };
    });
  }
}
