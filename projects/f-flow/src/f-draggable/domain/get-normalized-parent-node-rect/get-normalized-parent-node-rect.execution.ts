import {inject, Injectable} from '@angular/core';
import { GetNormalizedParentNodeRectRequest } from './get-normalized-parent-node-rect.request';
import { IRect, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { FComponentsStore } from '../../../f-storage';
import { GetNodePaddingRequest } from '../../../domain';
import { GetNormalizedElementRectRequest } from '../../../domain';

@Injectable()
@FExecutionRegister(GetNormalizedParentNodeRectRequest)
export class GetNormalizedParentNodeRectExecution
  implements IExecution<GetNormalizedParentNodeRectRequest, IRect> {

  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fMediator = inject(FMediator);

  public handle(request: GetNormalizedParentNodeRectRequest): IRect {
    let result = RectExtensions.initialize(-Infinity, -Infinity, Infinity, Infinity);
    const parentNode = this._getNode(request.fNode.fParentId);
    if (parentNode) {
      result = this._getParentRect(parentNode);
    }
    return result;
  }

  private _getNode(fId?: string | null): FNodeBase | undefined {
    return this._fComponentsStore.fNodes.find((x) => x.fId() === fId);
  }
  //   Parent Node
  // +----------------------------------------+
  // |  padding-top                           |
  // |  +----------------------------------+  |
  // |  |                                  |  |
  // |  |   Available area for             |  |
  // |p |   child nodes                    |p |
  // |a |                                  |a |
  // |d |   (width - padLeft - padRight)   |d |
  // |  |                                  |d |
  // |l |   (height - padTop - padBottom)  |i |
  // |e |                                  |n |
  // |f |                                  |g |
  // |t |                                  |  |
  // |  |                                  |r |
  // |  |                                  |i |
  // |  |                                  |g |
  // |  |                                  |h |
  // |  |                                  |t |
  // |  +----------------------------------+  |
  // |  padding-bottom                        |
  // +----------------------------------------+
  private _getParentRect(node: FNodeBase): IRect {
    const rect = this._getNodeRect(node);
    const padding = this._getNodePadding(node, rect);
    return RectExtensions.initialize(
      rect.x + padding[ 0 ],
      rect.y + padding[ 1 ],
      rect.width - padding[ 0 ] - padding[ 2 ],
      rect.height - padding[ 1 ] - padding[ 3 ]
    );
  }

  private _getNodeRect(fNode: FNodeBase): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(fNode.hostElement));
  }

  private _getNodePadding(node: FNodeBase, rect: IRect): [ number, number, number, number ] {
    return this._fMediator.execute<[ number, number, number, number ]>(new GetNodePaddingRequest(node, rect));
  }
}
