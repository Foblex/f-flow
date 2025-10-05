import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { SelectAndUpdateNodeLayerRequest } from './select-and-update-node-layer.request';
import { FDraggableDataContext } from '../../../f-draggable';
import { UpdateItemAndChildrenLayersRequest } from '../../update-item-and-children-layers';
import { FNodeBase } from '../../../f-node';
import { LogExecutionTime } from '../../log-execution-time';

/**
 * Execution that selects a node and updates its layer along with its children.
 * It checks if the node is already selected, and if not, it marks it as selected
 * and updates the layers of the node and its children.
 */
@Injectable()
@FExecutionRegister(SelectAndUpdateNodeLayerRequest)
export class SelectAndUpdateNodeLayerExecution
  implements IHandler<SelectAndUpdateNodeLayerRequest, void>
{
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _mediator = inject(FMediator);

  @LogExecutionTime('SelectAndUpdateNodeLayerExecution')
  public handle({ nodeOrGroup }: SelectAndUpdateNodeLayerRequest): void {
    this._selectNodeIfNotSelected(nodeOrGroup);

    this._mediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        nodeOrGroup,
        nodeOrGroup.hostElement.parentElement as HTMLElement,
      ),
    );
  }

  private _selectNodeIfNotSelected(fNode: FNodeBase) {
    if (!this._dragContext.selectedItems.includes(fNode) && !fNode.fSelectionDisabled()) {
      this._dragContext.selectedItems.push(fNode);
      fNode.markAsSelected();
      this._dragContext.isSelectedChanged = true;
    }
  }
}
