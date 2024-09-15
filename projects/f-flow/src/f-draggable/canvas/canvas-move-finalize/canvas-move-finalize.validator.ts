import { Injectable } from '@angular/core';
import { CanvasMoveFinalizeRequest } from './canvas-move-finalize.request';
import { FValidatorRegister, IValidator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { CanvasDragHandler } from '../canvas.drag-handler';

@Injectable()
@FValidatorRegister(CanvasMoveFinalizeRequest)
export class CanvasMoveFinalizeValidator implements IValidator<CanvasMoveFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: CanvasMoveFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some(
      (x) => x instanceof CanvasDragHandler
    );
  }
}
