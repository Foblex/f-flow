import { Injectable } from '@angular/core';
import { MinimapDragFinalizeRequest } from './minimap-drag-finalize.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FDraggableDataContext } from '../../../f-draggable';
import { FMinimapDragHandler } from '../f-minimap.drag-handler';

@Injectable()
@FValidatorRegister(MinimapDragFinalizeRequest)
export class MinimapDragFinalizeValidator implements IValidator<MinimapDragFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: MinimapDragFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some(
      (x) => x.constructor.name === FMinimapDragHandler.name
    );
  }
}
