import { Injectable } from '@angular/core';
import { ExternalItemFinalizeRequest } from './external-item-finalize.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FDraggableDataContext } from '../../../f-draggable';
import { ExternalItemDragHandler } from '../external-item.drag-handler';


@Injectable()
@FValidatorRegister(ExternalItemFinalizeRequest)
export class ExternalItemFinalizeValidator implements IValidator<ExternalItemFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: ExternalItemFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some(
      (x) => x instanceof ExternalItemDragHandler
    );
  }
}
