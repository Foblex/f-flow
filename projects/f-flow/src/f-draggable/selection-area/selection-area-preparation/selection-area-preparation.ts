import { inject, Injectable } from '@angular/core';
import { SelectionAreaPreparationRequest } from './selection-area-preparation-request';
import { Point } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore, INSTANCES } from '../../../f-storage';
import {
  DragHandlerInjector,
  FDraggableDataContext,
  SelectionAreaHandler,
} from '../../../f-draggable';
import { isValidEventTrigger } from '../../../domain';
import { FSelectionAreaBase } from '../../../f-selection-area';

@Injectable()
@FExecutionRegister(SelectionAreaPreparationRequest)
export class SelectionAreaPreparation implements IExecution<SelectionAreaPreparationRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _dragInjector = inject(DragHandlerInjector);

  private get _instance(): FSelectionAreaBase | undefined {
    return this._store.instances.get(INSTANCES.SELECTION_AREA);
  }

  public handle(request: SelectionAreaPreparationRequest): void {
    if (!this._isValid(request)) {
      return;
    }

    this._dragSession.onPointerDownScale = 1;
    this._dragSession.onPointerDownPosition = Point.fromPoint(
      request.event.getPosition(),
    ).elementTransform(this._store.flowHost);
    this._dragSession.draggableItems = [this._dragInjector.createInstance(SelectionAreaHandler)];
  }

  private _isValid(request: SelectionAreaPreparationRequest): boolean {
    return (
      !!this._instance &&
      this._dragSession.isEmpty() &&
      isValidEventTrigger(request.event.originalEvent, this._instance.fTrigger)
    );
  }
}
