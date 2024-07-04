import { Injectable } from '@angular/core';
import { SelectionAreaPreparationRequest } from './selection-area-preparation.request';
import { Point } from '@foblex/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { SelectionAreaDragHandle } from '../selection-area.drag-handle';

@Injectable()
@FExecutionRegister(SelectionAreaPreparationRequest)
export class SelectionAreaPreparationExecution implements IExecution<SelectionAreaPreparationRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: SelectionAreaPreparationRequest): void {
    this.fDraggableDataContext.draggableItems = [
      new SelectionAreaDragHandle(this.fComponentsStore, this.fDraggableDataContext, this.fMediator)
    ];

    this.fDraggableDataContext.onPointerDownScale = 1;
    this.fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this.flowHost);
  }
}
