import { inject, Injectable } from '@angular/core';
import { GetNodeResizeRestrictionsRequest } from './get-node-resize-restrictions.request';
import { IRect, SizeExtensions } from '@foblex/2d';
import { INodeResizeRestrictions } from './i-node-resize-restrictions';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetNormalizedParentNodeRectRequest } from '../../domain';
import { GetNormalizedChildrenNodesRectRequest } from '../get-normalized-children-nodes-rect';
import { FNodeBase } from '../../../f-node';
import { GetNodePaddingRequest } from '../../../domain';


@Injectable()
@FExecutionRegister(GetNodeResizeRestrictionsRequest)
export class GetNodeResizeRestrictionsExecution
  implements IExecution<GetNodeResizeRestrictionsRequest, INodeResizeRestrictions> {

  private _fMediator = inject(FMediator);

  public handle(request: GetNodeResizeRestrictionsRequest): INodeResizeRestrictions {
    const paddings = this._calculateNodePaddings(request.fNode, request.rect);

    return {
      parentBounds: this._getNormalizedParentBounds(request.fNode),
      childrenBounds: this._getNormalizedChildrenBounds(request.fNode, paddings),
      minimumSize: SizeExtensions.initialize(paddings[0] + paddings[2], paddings[1] + paddings[3])
    }
  }

  private _calculateNodePaddings(node: FNodeBase, rect: IRect): [ number, number, number, number ] {
    return this._fMediator.execute<[ number, number, number, number ]>(new GetNodePaddingRequest(node, rect));
  }

  private _getNormalizedParentBounds(fNode: FNodeBase): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedParentNodeRectRequest(fNode));
  }

  private _getNormalizedChildrenBounds(fNode: FNodeBase, fNodePaddings: [ number, number, number, number ]): IRect | null {
    return this._fMediator.execute<IRect | null>(new GetNormalizedChildrenNodesRectRequest(fNode, fNodePaddings));
  }
}
