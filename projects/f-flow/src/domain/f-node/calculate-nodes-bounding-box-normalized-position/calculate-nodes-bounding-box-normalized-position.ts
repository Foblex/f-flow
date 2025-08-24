import { IRect, RectExtensions } from '@foblex/2d';
import { CalculateNodesBoundingBoxNormalizedPositionRequest } from './calculate-nodes-bounding-box-normalized-position.request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';

/**
 * Execution that calculates the bounding box of all nodes in the FComponentsStore
 * and returns their normalized positions.
 * It retrieves the rectangles of each node's host element and computes their union.
 */
@Injectable()
@FExecutionRegister(CalculateNodesBoundingBoxNormalizedPositionRequest)
export class CalculateNodesBoundingBoxNormalizedPosition
  implements IExecution<CalculateNodesBoundingBoxNormalizedPositionRequest, IRect | null> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: CalculateNodesBoundingBoxNormalizedPositionRequest): IRect | null {
    return RectExtensions.union(this._getNodesRects(request.fNodes || this._store.fNodes));
  }

  private _getNodesRects(fNodes: FNodeBase[]): IRect[] {
    return fNodes.map((x) => {
      return this._getElementRect(x, RectExtensions.fromElement(x.hostElement));
    });
  }

  private _getElementRect(fNode: FNodeBase, rect: IRect): IRect {
    return RectExtensions.initialize(fNode._position.x, fNode._position.y, rect.width, rect.height)
  }
}
