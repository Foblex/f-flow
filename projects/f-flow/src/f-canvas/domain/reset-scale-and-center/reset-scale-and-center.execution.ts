import { Injectable } from '@angular/core';
import { ResetScaleAndCenterRequest } from './reset-scale-and-center-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { F_CANVAS_ANIMATION_DURATION, GetNodesRectRequest } from '../../../domain';
import { FComponentsStore } from '../../../f-storage';


@Injectable()
@FExecutionRegister(ResetScaleAndCenterRequest)
export class ResetScaleAndCenterExecution implements IExecution<ResetScaleAndCenterRequest, void> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator
  ) {
  }

  public handle(request: ResetScaleAndCenterRequest): void {
    const fNodesRect = this.fMediator.send<IRect | null>(new GetNodesRectRequest()) || RectExtensions.initialize();
    if (fNodesRect.width === 0 || fNodesRect.height === 0) {
      return;
    }
    this.oneToOneCentering(
      fNodesRect,
      RectExtensions.fromElement(this.fComponentsStore.fFlow!.hostElement),
      this.fComponentsStore.fNodes.map((x) => x.position)
    );

    request.animated ? this.fComponentsStore.fCanvas!.redrawWithAnimation() : this.fComponentsStore.fCanvas!.redraw();
    this.fComponentsStore.fCanvas!.emitCanvasChangeEvent();
    setTimeout(() => this.fComponentsStore.componentDataChanged(), F_CANVAS_ANIMATION_DURATION);
  }

  public oneToOneCentering(rect: IRect, parentRect: IRect, points: IPoint[]): void {
    this.transform.scaledPosition = PointExtensions.initialize();
    this.transform.position = this.getZeroPositionWithoutScale(points);

    const newX = (parentRect.width - rect.width / this.transform.scale) / 2 - this.transform.position.x;
    const newY = (parentRect.height - rect.height / this.transform.scale) / 2 - this.transform.position.y;

    this.transform.scale = 1;
    this.transform.position = PointExtensions.initialize(newX, newY);
  }

  private getZeroPositionWithoutScale(points: IPoint[]): IPoint {
    const xPoint = points.length ? Math.min(...points.map((point) => point.x)) : 0;
    const yPoint = points.length ? Math.min(...points.map((point) => point.y)) : 0;
    return PointExtensions.initialize(xPoint, yPoint)
  }
}
