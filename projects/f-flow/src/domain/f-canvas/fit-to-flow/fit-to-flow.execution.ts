import { Injectable } from '@angular/core';
import { FitToFlowRequest } from './fit-to-flow-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { F_CANVAS_ANIMATION_DURATION, GetNodesRectRequest } from '../../../domain';

@Injectable()
@FExecutionRegister(FitToFlowRequest)
export class FitToFlowExecution implements IExecution<FitToFlowRequest, void> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator
  ) {
  }

  public handle(request: FitToFlowRequest): void {
    const fNodesRect = this.fMediator.send<IRect | null>(new GetNodesRectRequest()) || RectExtensions.initialize();
    if (fNodesRect.width === 0 || fNodesRect.height === 0) {
      return;
    }

    this.fitToParent(
      fNodesRect,
      RectExtensions.fromElement(this.fComponentsStore.fFlow!.hostElement),
      this.fComponentsStore.fNodes.map((x) => x.position),
      request.toCenter
    );
    request.animated ? this.fComponentsStore.fCanvas!.redrawWithAnimation() : this.fComponentsStore.fCanvas!.redraw();
    this.fComponentsStore.fCanvas!.emitCanvasChangeEvent();
    setTimeout(() => this.fComponentsStore.componentDataChanged(), F_CANVAS_ANIMATION_DURATION);
  }

  public fitToParent(rect: IRect, parentRect: IRect, points: IPoint[], toCenter: IPoint): void {
    this.transform.scaledPosition = PointExtensions.initialize();
    this.transform.position = this.getZeroPositionWithoutScale(points);
    const itemsContainerWidth = (rect.width / this.transform.scale) + toCenter.x;
    const itemsContainerHeight = (rect.height / this.transform.scale) + toCenter.y;
    if (
      (itemsContainerWidth > parentRect.width || itemsContainerHeight > parentRect.height) ||
      itemsContainerWidth < parentRect.width && itemsContainerHeight < parentRect.height
    ) {
      this.transform.scale = Math.min(parentRect.width / itemsContainerWidth, parentRect.height / itemsContainerHeight);
    }

    const newX = (parentRect.width - itemsContainerWidth * this.transform.scale) / 2 - this.transform.position.x * this.transform.scale;
    const newY = (parentRect.height - itemsContainerHeight * this.transform.scale) / 2 - this.transform.position.y * this.transform.scale;

    this.transform.position = PointExtensions.initialize(newX + (toCenter.x / 2) * this.transform.scale, newY + (toCenter.y / 2) * this.transform.scale)
  }

  private getZeroPositionWithoutScale(points: IPoint[]): IPoint {
    const xPoint = points.length ? Math.min(...points.map((point) => point.x)) : 0;
    const yPoint = points.length ? Math.min(...points.map((point) => point.y)) : 0;
    return PointExtensions.initialize(xPoint, yPoint)
  }
}
