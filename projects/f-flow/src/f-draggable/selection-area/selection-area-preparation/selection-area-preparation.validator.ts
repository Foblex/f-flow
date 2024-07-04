import { Injectable } from '@angular/core';
import { SelectionAreaPreparationRequest } from './selection-area-preparation.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { MouseEventExtensions } from '@foblex/core';

@Injectable()
@FValidatorRegister(SelectionAreaPreparationRequest)
export class SelectionAreaPreparationValidator implements IValidator<SelectionAreaPreparationRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: SelectionAreaPreparationRequest): boolean {
    return this.isDragHandlesEmpty()
      && MouseEventExtensions.isShiftPressed(request.event.originalEvent)
      && !!this.fDraggableDataContext.fSelectionArea;
  }

  private isDragHandlesEmpty(): boolean {
    return !this.fDraggableDataContext.draggableItems.length;
  }
}
