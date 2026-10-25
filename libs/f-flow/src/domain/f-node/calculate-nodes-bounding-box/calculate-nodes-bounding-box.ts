import { IRect, RectExtensions } from '../../../_libs/f-2d';
import { CalculateNodesBoundingBoxRequest } from './calculate-nodes-bounding-box-request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { IExecution } from '../../../_libs/f-mediator';

/**
 * Execution that calculates the bounding box of all nodes in the FComponentsStore.
 * It retrieves the rectangles of each node's host element and computes their union.
 */
@Injectable()
export class CalculateNodesBoundingBox implements IExecution<
  CalculateNodesBoundingBoxRequest,
  IRect | null
> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: CalculateNodesBoundingBoxRequest): IRect | null {
    return RectExtensions.union(this._nodesRects());
  }

  private _nodesRects(): IRect[] {
    return this._store.nodes.getAll().map((x) => RectExtensions.fromElement(x.hostElement));
  }
}
