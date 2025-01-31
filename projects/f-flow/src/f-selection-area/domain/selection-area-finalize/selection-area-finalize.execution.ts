import { inject, Injectable } from '@angular/core';
import { SelectionAreaFinalizeRequest } from './selection-area-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable';
import { SelectionAreaDragHandle } from '../selection-area.drag-handle';

@Injectable()
@FExecutionRegister(SelectionAreaFinalizeRequest)
export class SelectionAreaFinalizeExecution implements IExecution<SelectionAreaFinalizeRequest, void> {

  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: SelectionAreaFinalizeRequest): void {
    if(!this._isValid()) {
      return;
    }
    this._fDraggableDataContext.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this._fDraggableDataContext.draggableItems.some((x) =>
      x instanceof SelectionAreaDragHandle
    );
  }
}
