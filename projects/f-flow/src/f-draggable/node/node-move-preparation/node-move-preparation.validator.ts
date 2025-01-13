import { inject, Injectable } from '@angular/core';
import { NodeMovePreparationRequest } from './node-move-preparation.request';
import { FValidatorRegister, IValidator } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeBase } from '../../../f-node';
import { isClosestElementHasClass } from '@foblex/utils';

@Injectable()
@FValidatorRegister(NodeMovePreparationRequest)
export class NodeMovePreparationValidator implements IValidator<NodeMovePreparationRequest> {

  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: NodeMovePreparationRequest): boolean {
    return this._isDragHandlesEmpty()
      && this._isDragHandleElement(request.event.targetElement)
      && this._isNodeCanBeDragged(this._getNode(request.event.targetElement));
  }

  private _isDragHandlesEmpty(): boolean {
    return !this._fDraggableDataContext.draggableItems.length;
  }

  private _isDragHandleElement(element: HTMLElement): boolean {
    return isClosestElementHasClass(element, '.f-drag-handle');
  }

  private _isNodeCanBeDragged(fNode: FNodeBase | undefined): boolean {
    return !!fNode && !fNode.fDraggingDisabled;
  }

  private _getNode(element: HTMLElement): FNodeBase | undefined {
    return this._fComponentsStore.fNodes.find(x => x.isContains(element));
  }
}
