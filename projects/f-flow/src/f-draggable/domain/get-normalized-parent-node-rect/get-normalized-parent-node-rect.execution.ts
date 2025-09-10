import { inject, Injectable } from '@angular/core';
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

  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  public handle({ nodeOrGroup }: GetNormalizedParentNodeRectRequest): IRect {
    let result = RectExtensions.initialize(-Infinity, -Infinity, Infinity, Infinity);
    const parentNode = this._getNode(nodeOrGroup.fParentId());
    if (parentNode) {
      result = this._getParentRect(parentNode);
    }

    return result;
  }

  private _getNode(fId?: string | null): FNodeBase | undefined {
    return this._store.fNodes.find((x) => x.fId() === fId);
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
  private _getParentRect(nodeOrGroup: FNodeBase): IRect {
    const rect = this._getNodeRect(nodeOrGroup);
    const padding = this._getNodePadding(nodeOrGroup, rect);

    return RectExtensions.initialize(
      rect.x + padding[ 0 ],
      rect.y + padding[ 1 ],
      rect.width - padding[ 0 ] - padding[ 2 ],
      rect.height - padding[ 1 ] - padding[ 3 ],
    );
  }

  private _getNodeRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }

  private _getNodePadding(nodeOrGroup: FNodeBase, rect: IRect): [ number, number, number, number ] {
    return this._mediator.execute<[ number, number, number, number ]>(new GetNodePaddingRequest(nodeOrGroup, rect));
  }
}
