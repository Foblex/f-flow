import { Injectable } from '@angular/core';
import { SelectionAreaPreparationRequest } from './selection-area-preparation.request';
import { Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { SelectionAreaDragHandle } from '../selection-area.drag-handle';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(SelectionAreaPreparationRequest)
export class SelectionAreaPreparationExecution implements IExecution<SelectionAreaPreparationRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FMediator
  ) {
  }

  public handle(request: SelectionAreaPreparationRequest): void {
    this.fDraggableDataContext.draggableItems = [
      new SelectionAreaDragHandle(
        this.fComponentsStore, request.fSelectionArea, this.fDraggableDataContext, this.fMediator
      )
    ];

    this.fDraggableDataContext.onPointerDownScale = 1;
    this.fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this.flowHost);
  }
}
