import { IHandler } from '@foblex/mediator';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { SelectAndUpdateNodeLayerRequest } from './select-and-update-node-layer.request';
import { FDraggableDataContext } from '../../../f-draggable';
import { UpdateItemAndChildrenLayersRequest } from '../../update-item-and-children-layers';
import { FNodeBase } from '../../../f-node';

@Injectable()
@FExecutionRegister(SelectAndUpdateNodeLayerRequest)
export class SelectAndUpdateNodeLayerExecution implements IHandler<SelectAndUpdateNodeLayerRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FMediator
  ) {
  }
  public handle(request: SelectAndUpdateNodeLayerRequest): void {
    this.selectNodeIfNotSelected(request.fNode);

    this.fMediator.send<void>(
      new UpdateItemAndChildrenLayersRequest(request.fNode, request.fNode.hostElement.parentElement as HTMLElement)
    );
  }

  private selectNodeIfNotSelected(fNode: FNodeBase) {
    if (!this.fDraggableDataContext.selectedItems.includes(fNode) && !fNode.fSelectionDisabled) {
      this.fDraggableDataContext.selectedItems.push(fNode);
      fNode.markAsSelected();
      this.fDraggableDataContext.isSelectedChanged = true;
    }
  }
}
