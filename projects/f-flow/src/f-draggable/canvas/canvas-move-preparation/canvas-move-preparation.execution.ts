import { Injectable } from '@angular/core';
import { CanvasMovePreparationRequest } from './canvas-move-preparation.request';
import { Point } from '@foblex/core';
import { FExecutionRegister, IExecution } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { CanvasDragHandler } from '../canvas.drag-handler';

@Injectable()
@FExecutionRegister(CanvasMovePreparationRequest)
export class CanvasMovePreparationExecution implements IExecution<CanvasMovePreparationRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: CanvasMovePreparationRequest): void {
    this.fDraggableDataContext.onPointerDownScale = 1;
    this.fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this.flowHost);
    this.fDraggableDataContext.draggableItems = [
      new CanvasDragHandler(this.fComponentsStore)
    ];
  }
}
