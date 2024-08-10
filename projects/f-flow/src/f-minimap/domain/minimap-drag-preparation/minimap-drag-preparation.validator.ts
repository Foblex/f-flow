import { Injectable } from '@angular/core';
import { MinimapDragPreparationRequest } from './minimap-drag-preparation.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FValidatorRegister(MinimapDragPreparationRequest)
export class MinimapDragPreparationValidator implements IValidator<MinimapDragPreparationRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: MinimapDragPreparationRequest): boolean {
    return !this.fDraggableDataContext.draggableItems.length &&
      !!request.event.targetElement.closest('.f-minimap');
  }
}
