import { inject, Injectable } from '@angular/core';
import { FitToFlowRequest } from './fit-to-flow-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import {
  CalculateNodesBoundingBoxRequest,
  RedrawCanvasWithAnimationRequest,
} from '../../../domain';

/**
 * Fits all nodes and groups to the flow by scaling and positioning them
 */
@Injectable()
@FExecutionRegister(FitToFlowRequest)
export class FitToFlowExecution implements IExecution<FitToFlowRequest, void> {
  private readonly _store = inject(FComponentsStore);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  private _fMediator = inject(FMediator);

  public handle(request: FitToFlowRequest): void {
    const fNodesRect =
      this._fMediator.execute<IRect | null>(new CalculateNodesBoundingBoxRequest()) ||
      RectExtensions.initialize();
    if (fNodesRect.width === 0 || fNodesRect.height === 0) {
      return;
    }

    this.fitToParent(
      fNodesRect,
      RectExtensions.fromElement(this._store.flowHost),
      this._store.nodes.getAll().map((x) => x._position),
      request.toCenter,
    );

    this._fMediator.execute(new RedrawCanvasWithAnimationRequest(request.animated));
  }

  public fitToParent(rect: IRect, parentRect: IRect, points: IPoint[], toCenter: IPoint): void {
    this._transform.scaledPosition = PointExtensions.initialize();
    this._transform.position = this._getZeroPositionWithoutScale(points);
    const itemsContainerWidth = rect.width / this._transform.scale + toCenter.x;
    const itemsContainerHeight = rect.height / this._transform.scale + toCenter.y;
    if (
      itemsContainerWidth > parentRect.width ||
      itemsContainerHeight > parentRect.height ||
      (itemsContainerWidth < parentRect.width && itemsContainerHeight < parentRect.height)
    ) {
      this._transform.scale = Math.min(
        parentRect.width / itemsContainerWidth,
        parentRect.height / itemsContainerHeight,
      );
    }

    const newX =
      (parentRect.width - itemsContainerWidth * this._transform.scale) / 2 -
      this._transform.position.x * this._transform.scale;
    const newY =
      (parentRect.height - itemsContainerHeight * this._transform.scale) / 2 -
      this._transform.position.y * this._transform.scale;

    this._transform.position = PointExtensions.initialize(
      newX + (toCenter.x / 2) * this._transform.scale,
      newY + (toCenter.y / 2) * this._transform.scale,
    );
  }

  private _getZeroPositionWithoutScale(points: IPoint[]): IPoint {
    const xPoint = points.length ? Math.min(...points.map((point) => point.x)) : 0;
    const yPoint = points.length ? Math.min(...points.map((point) => point.y)) : 0;

    return PointExtensions.initialize(xPoint, yPoint);
  }
}
