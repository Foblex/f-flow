import { Injectable } from '@angular/core';
import { SelectionAreaFinalizeRequest } from './selection-area-finalize.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FDraggableDataContext } from '../../../f-draggable';
import { SelectionAreaDragHandle } from '../selection-area.drag-handle';

@Injectable()
@FValidatorRegister(SelectionAreaFinalizeRequest)
export class SelectionAreaFinalizeValidator implements IValidator<SelectionAreaFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: SelectionAreaFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some((x) =>
      x instanceof SelectionAreaDragHandle
    );
  }
}
