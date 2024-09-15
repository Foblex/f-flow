import { Injectable } from '@angular/core';
import { MinimapDragPreparationRequest } from './minimap-drag-preparation.request';
import { IPoint, IRect, Point, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FMinimapDragHandler } from '../f-minimap.drag-handler';
import { FDraggableDataContext } from '../../../f-draggable';
import { CalculateFlowPointFromMinimapPointRequest } from '../calculate-flow-point-from-minimap-point';
import { FMinimapData } from '../f-minimap-data';

@Injectable()
@FExecutionRegister(MinimapDragPreparationRequest)
export class MinimapDragPreparationExecution implements IExecution<MinimapDragPreparationRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator,
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: MinimapDragPreparationRequest): void {
    const eventPoint = request.event.getPosition();
    const startCanvasPosition = Point.fromPoint(this.fComponentsStore.fCanvas!.transform.position);

    this.fComponentsStore.fCanvas!.setPosition(this.getNewPosition(eventPoint, request.minimap));
    this.fComponentsStore.fCanvas!.redraw();
    this.fComponentsStore.fCanvas!.completeDrag();

    this.fDraggableDataContext.onPointerDownScale = 1;
    this.fDraggableDataContext.onPointerDownPosition = Point.fromPoint(eventPoint).elementTransform(this.flowHost);
    this.fDraggableDataContext.draggableItems = [
      new FMinimapDragHandler(
        this.fComponentsStore, this.fMediator, this.getFlowRect(),
        startCanvasPosition, eventPoint, request.minimap,
      )
    ];
  }

  private getNewPosition(eventPoint: IPoint, minimap: FMinimapData): IPoint {
    return this.fMediator.send<IPoint>(new CalculateFlowPointFromMinimapPointRequest(
      this.getFlowRect(),
      Point.fromPoint(this.fComponentsStore.fCanvas!.transform.position),
      eventPoint, minimap,
    ));
  }

  private getFlowRect(): IRect {
    return RectExtensions.fromElement(this.flowHost);
  }
}
