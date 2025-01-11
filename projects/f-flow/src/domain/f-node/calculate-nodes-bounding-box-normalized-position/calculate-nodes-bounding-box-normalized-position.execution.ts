import { IRect, RectExtensions } from '@foblex/2d';
import { CalculateNodesBoundingBoxNormalizedPositionRequest } from './calculate-nodes-bounding-box-normalized-position.request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';

@Injectable()
@FExecutionRegister(CalculateNodesBoundingBoxNormalizedPositionRequest)
export class CalculateNodesBoundingBoxNormalizedPositionExecution implements IExecution<CalculateNodesBoundingBoxNormalizedPositionRequest, IRect | null> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: CalculateNodesBoundingBoxNormalizedPositionRequest): IRect | null {
    return RectExtensions.union(this._getNodesRects());
  }

  private _getNodesRects(): IRect[] {
    return this._fComponentsStore.fNodes.map((x) => {
      return this._getElementRect(x, RectExtensions.fromElement(x.hostElement));
    });
  }

  private _getElementRect(fNode: FNodeBase, rect: IRect): IRect {
    return RectExtensions.initialize(fNode.position.x, fNode.position.y, rect.width, rect.height)
  }
}
