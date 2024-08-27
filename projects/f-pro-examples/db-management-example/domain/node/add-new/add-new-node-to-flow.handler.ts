import { GuidExtensions, IHandler } from '@foblex/core';
import { AddNewNodeToFlowRequest } from './add-new-node-to-flow.request';
import { IFlowStorage } from '../../flow.storage';
import { EDbTableFieldType } from '../../e-db-table-field-type';

export class AddNewNodeToFlowHandler implements IHandler<AddNewNodeToFlowRequest> {

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(request: AddNewNodeToFlowRequest): void {
    this.flow.nodes.push({
      id: GuidExtensions.generate(),
      name: 'table_' + (this.flow.nodes.length + 1),
      position: request.position,
      fields: [
        {
          id: GuidExtensions.generate(),
          name: 'id',
          type: EDbTableFieldType.INT
        }
      ],
    });
  }
}
