import { IHandler } from '@foblex/core';
import { SelectAndUpdateNodeLayerRequest } from './select-and-update-node-layer.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FFlowMediator } from '../../infrastructure';
import { FNodeBase } from '../../f-node';
import { FDraggableDataContext } from '../../f-draggable';
import { UpdateItemLayerRequest } from '../update-item-layer';
import { FComponentsStore } from '../../f-storage';

@Injectable()
@FExecutionRegister(SelectAndUpdateNodeLayerRequest)
export class SelectAndUpdateNodeLayerExecution implements IHandler<SelectAndUpdateNodeLayerRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
    private fComponentsStore: FComponentsStore,
    private fMediator: FFlowMediator
  ) {
  }
  public handle(request: SelectAndUpdateNodeLayerRequest): void {
    this.selectNodeIfNotSelected(request.node);

    this.fMediator.send<void>(
      new UpdateItemLayerRequest(request.node, this.fComponentsStore.fCanvas!.fNodesContainer.nativeElement)
    );
  }

  private selectNodeIfNotSelected(node: FNodeBase) {
    if (!this.fDraggableDataContext.selectedItems.includes(node) && !node.fSelectionDisabled) {
      this.fDraggableDataContext.selectedItems.push(node);
      node.select();
      this.fDraggableDataContext.isSelectedChanged = true;
    }
  }
}
