import { IRect, RectExtensions } from '@foblex/2d';
import { CalculateNodesBoundingBoxNormalizedPositionRequest } from './calculate-nodes-bounding-box-normalized-position-request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { GetCachedFCacheRectRequest } from '../../../f-cache';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';

/**
 * Execution that calculates the bounding box of all nodes in the FComponentsStore
 * and returns their normalized positions.
 * It retrieves the rectangles of each node's host element and computes their union.
 */
@Injectable()
@FExecutionRegister(CalculateNodesBoundingBoxNormalizedPositionRequest)
export class CalculateNodesBoundingBoxNormalizedPosition implements IExecution<
  CalculateNodesBoundingBoxNormalizedPositionRequest,
  IRect | null
> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  public handle(request: CalculateNodesBoundingBoxNormalizedPositionRequest): IRect | null {
    return RectExtensions.union(this._getNodesRects(request.fNodes || this._store.nodes.getAll()));
  }

  private _getNodesRects(fNodes: FNodeBase[]): IRect[] {
    return fNodes.map((node) => this._getNodeRect(node));
  }

  private _getNodeRect(node: FNodeBase): IRect {
    const cached = this._mediator.execute<IRect | undefined>(
      new GetCachedFCacheRectRequest(node.hostElement),
    );
    if (cached) {
      return this._getElementRect(node, cached);
    }

    const normalizedRect = this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(node.hostElement),
    );

    return this._getElementRect(node, normalizedRect);
  }

  private _getElementRect(node: FNodeBase, rect: IRect): IRect {
    return RectExtensions.initialize(node._position.x, node._position.y, rect.width, rect.height);
  }
}
