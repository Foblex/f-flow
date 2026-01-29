import { inject, Injectable } from '@angular/core';
import { SelectionAreaPreparationRequest } from './selection-area-preparation.request';
import { Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { SelectionAreaDragHandle } from '../selection-area.drag-handle';
import { FDraggableDataContext } from '../../../f-draggable';
import { isValidEventTrigger } from '../../../domain';

@Injectable()
@FExecutionRegister(SelectionAreaPreparationRequest)
export class SelectionAreaPreparationExecution
  implements IExecution<SelectionAreaPreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(request: SelectionAreaPreparationRequest): void {
    if (!this._isValid(request)) {
      return;
    }
    this._dragContext.draggableItems = [
      new SelectionAreaDragHandle(
        this._store,
        request.fSelectionArea,
        this._dragContext,
        this._mediator,
      ),
    ];

    this._dragContext.onPointerDownScale = 1;
    this._dragContext.onPointerDownPosition = Point.fromPoint(
      request.event.getPosition(),
    ).elementTransform(this._store.flowHost);
  }

  private _isValid(request: SelectionAreaPreparationRequest): boolean {
    return (
      this._dragContext.isEmpty() &&
      isValidEventTrigger(request.event.originalEvent, request.fTrigger)
    );
  }
}
