import { inject, Injectable } from '@angular/core';
import { SelectionAreaFinalizeRequest } from './selection-area-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(SelectionAreaFinalizeRequest)
export class SelectionAreaFinalize implements IExecution<SelectionAreaFinalizeRequest, void> {
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle(_request: SelectionAreaFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this._dragSession.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this._dragSession.draggableItems.some((x) => x.getEvent().kind === 'selection-area');
  }
}
