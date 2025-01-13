import { Injectable } from '@angular/core';
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

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator
  ) {
  }

  public handle(request: GetNormalizedParentNodeRectRequest): IRect {
    let result = RectExtensions.initialize(-Infinity, -Infinity, Infinity, Infinity);
    const parentNode = this.getNode(request.fNode.fParentId);
    if (parentNode) {
      result = this.getParentRect(parentNode);
    }
    return result;
  }

  private getNode(fId?: string | null): FNodeBase | undefined {
    return this.fComponentsStore.fNodes.find((x) => x.fId === fId);
  }

  private getParentRect(node: FNodeBase): IRect {
    const rect = this._getNodeRect(node);
    const padding = this.getNodePadding(node, rect);
    return RectExtensions.initialize(
      rect.x + padding[ 0 ],
      rect.y + padding[ 1 ],
      rect.width - padding[ 0 ] - padding[ 2 ],
      rect.height - padding[ 1 ] - padding[ 3 ]
    );
  }

  private _getNodeRect(fNode: FNodeBase): IRect {
    return this.fMediator.send<IRect>(new GetNormalizedElementRectRequest(fNode.hostElement));
  }

  private getNodePadding(node: FNodeBase, rect: IRect): [ number, number, number, number ] {
    return this.fMediator.send<[ number, number, number, number ]>(new GetNodePaddingRequest(node, rect));
  }
}
