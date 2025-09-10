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
export class SelectionAreaPreparationExecution implements IExecution<SelectionAreaPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _store = inject(FComponentsStore);
  private _dragContext = inject(FDraggableDataContext);

  private get _fHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  public handle(request: SelectionAreaPreparationRequest): void {
    if (!this._isValid(request)) {
      return;
    }
    this._dragContext.draggableItems = [
      new SelectionAreaDragHandle(
        this._store, request.fSelectionArea, this._dragContext, this._fMediator,
      ),
    ];

    this._dragContext.onPointerDownScale = 1;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost);
  }

  private _isValid(request: SelectionAreaPreparationRequest): boolean {
    return this._dragContext.isEmpty()
      && isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }
}
