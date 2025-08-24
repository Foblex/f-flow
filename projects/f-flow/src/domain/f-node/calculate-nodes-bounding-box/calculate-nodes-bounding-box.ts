import { IRect, RectExtensions } from '@foblex/2d';
import { CalculateNodesBoundingBoxRequest } from './calculate-nodes-bounding-box.request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

/**
 * Execution that calculates the bounding box of all nodes in the FComponentsStore.
 * It retrieves the rectangles of each node's host element and computes their union.
 */
@Injectable()
@FExecutionRegister(CalculateNodesBoundingBoxRequest)
export class CalculateNodesBoundingBox implements IExecution<CalculateNodesBoundingBoxRequest, IRect | null> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: CalculateNodesBoundingBoxRequest): IRect | null {
    return RectExtensions.union(this._getNodesRects());
  }

  private _getNodesRects(): IRect[] {
    return this._store.fNodes.map((x) => this._getElementRect(x.hostElement));
  }

  private _getElementRect(element: HTMLElement | SVGElement): IRect {
    return RectExtensions.fromElement(element)
  }
}
