import { FExecutionRegister, FMediator, IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { SelectAndUpdateNodeLayerRequest } from './select-and-update-node-layer-request';
import { FDraggableDataContext } from '../../../f-draggable';
import { UpdateItemAndChildrenLayersRequest } from '../../update-item-and-children-layers';
import { FNodeBase } from '../../../f-node';

/**
 * Execution that selects a node and updates its layer along with its children.
 * It checks if the node is already selected, and if not, it marks it as selected
 * and updates the layers of the node and its children.
 */
@Injectable()
@FExecutionRegister(SelectAndUpdateNodeLayerRequest)
export class SelectAndUpdateNodeLayer implements IHandler<SelectAndUpdateNodeLayerRequest, void> {
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _mediator = inject(FMediator);

  public handle({ nodeOrGroup }: SelectAndUpdateNodeLayerRequest): void {
    this._selectNodeIfNotSelected(nodeOrGroup);

    this._mediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        nodeOrGroup,
        nodeOrGroup.hostElement.parentElement as HTMLElement,
      ),
    );
  }

  private _selectNodeIfNotSelected(node: FNodeBase) {
    if (node.fSelectionDisabled()) {
      return;
    }
    if (this._dragSession.selectedItems.includes(node)) {
      return;
    }
    this._dragSession.selectedItems.push(node);
    node.markAsSelected();
    this._dragSession.isSelectedChanged = true;
  }
}
