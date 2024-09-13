import { Injectable } from '@angular/core';
import { SelectionAreaPreparationRequest } from './selection-area-preparation.request';
import { FDraggableDataContext } from '../../../f-draggable';
import { FValidatorRegister, IValidator } from '@foblex/mediator';

@Injectable()
@FValidatorRegister(SelectionAreaPreparationRequest)
export class SelectionAreaPreparationValidator implements IValidator<SelectionAreaPreparationRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: SelectionAreaPreparationRequest): boolean {
    return this.isDragHandlesEmpty()
      && this.isShiftPressed(request.event.originalEvent);
  }

  private isDragHandlesEmpty(): boolean {
    return !this.fDraggableDataContext.draggableItems.length;
  }

  private isShiftPressed(event: { shiftKey: boolean }): boolean {
    return event.shiftKey;
  }
}
