import { Injectable } from '@angular/core';
import { MinimapDragPreparationRequest } from './minimap-drag-preparation.request';
import { FValidatorRegister, IValidator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FValidatorRegister(MinimapDragPreparationRequest)
export class MinimapDragPreparationValidator implements IValidator<MinimapDragPreparationRequest> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: MinimapDragPreparationRequest): boolean {
    return !this.fDraggableDataContext.draggableItems.length &&
      !!request.event.targetElement.closest('.f-minimap') &&
      this.fComponentsStore.flowHost.contains(request.event.targetElement);
  }
}
