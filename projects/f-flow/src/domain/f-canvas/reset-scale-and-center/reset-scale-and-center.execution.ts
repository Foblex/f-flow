import { inject, Injectable } from '@angular/core';
import { ResetScaleAndCenterRequest } from './reset-scale-and-center-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { CalculateNodesBoundingBoxRequest, RedrawCanvasWithAnimationRequest } from '../../../domain';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(ResetScaleAndCenterRequest)
export class ResetScaleAndCenterExecution implements IExecution<ResetScaleAndCenterRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _fComponentsStore = inject(FComponentsStore);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  public handle(request: ResetScaleAndCenterRequest): void {
    const fNodesRect = this._fMediator.execute<IRect | null>(new CalculateNodesBoundingBoxRequest()) || RectExtensions.initialize();
    if (fNodesRect.width === 0 || fNodesRect.height === 0) {
      return;
    }
    this._oneToOneCentering(
      fNodesRect,
      RectExtensions.fromElement(this._fComponentsStore.fFlow!.hostElement),
      this._fComponentsStore.fNodes.map((x) => x.position)
    );

    this._fMediator.execute(new RedrawCanvasWithAnimationRequest(request.animated));
  }

  public _oneToOneCentering(rect: IRect, parentRect: IRect, points: IPoint[]): void {
    this._transform.scaledPosition = PointExtensions.initialize();
    this._transform.position = this._getZeroPositionWithoutScale(points);

    const newX = (parentRect.width - rect.width / this._transform.scale) / 2 - this._transform.position.x;
    const newY = (parentRect.height - rect.height / this._transform.scale) / 2 - this._transform.position.y;

    this._transform.scale = 1;
    this._transform.position = PointExtensions.initialize(newX, newY);
  }

  private _getZeroPositionWithoutScale(points: IPoint[]): IPoint {
    const xPoint = points.length ? Math.min(...points.map((point) => point.x)) : 0;
    const yPoint = points.length ? Math.min(...points.map((point) => point.y)) : 0;
    return PointExtensions.initialize(xPoint, yPoint)
  }
}
