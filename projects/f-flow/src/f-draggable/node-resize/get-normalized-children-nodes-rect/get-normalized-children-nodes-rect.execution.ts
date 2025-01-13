import { Injectable } from '@angular/core';
import { GetNormalizedChildrenNodesRectRequest } from './get-normalized-children-nodes-rect.request';
import { IRect, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { GetDeepChildrenNodesAndGroupsRequest, GetNormalizedElementRectRequest } from '../../../domain';

@Injectable()
@FExecutionRegister(GetNormalizedChildrenNodesRectRequest)
export class GetNormalizedChildrenNodesRectExecution
  implements IExecution<GetNormalizedChildrenNodesRectRequest, IRect | null> {

  constructor(
    private fMediator: FMediator
  ) {
  }

  public handle(request: GetNormalizedChildrenNodesRectRequest): IRect | null {
    const childNodeRect = RectExtensions.union(
      this.getChildrenNodes(request.fNode.fId).map((x) => this.normalizeRect(x))
    );
    return childNodeRect ?
      this.concatRectWithParentPadding(childNodeRect, request.paddings) : null;
  }

  private getChildrenNodes(fId: string): FNodeBase[] {
    return this.fMediator.send<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId));
  }

  private normalizeRect(fNode: FNodeBase): IRect {
    return this.fMediator.send<IRect>(new GetNormalizedElementRectRequest(fNode.hostElement));
  }

  private concatRectWithParentPadding(rect: IRect, padding: [ number, number, number, number ]): IRect {
    return RectExtensions.initialize(
      rect.x - padding[0],
      rect.y - padding[1],
      rect.width + padding[0] + padding[2],
      rect.height + + padding[1] + padding[3]
    );
  }
}
