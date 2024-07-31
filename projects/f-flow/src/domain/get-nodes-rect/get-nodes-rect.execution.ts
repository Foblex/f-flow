import { IRect, RectExtensions } from '@foblex/core';
import { GetNodesRectRequest } from './get-nodes-rect.request';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { FNodeBase } from '../../f-node';

@Injectable()
@FExecutionRegister(GetNodesRectRequest)
export class GetNodesRectExecution implements IExecution<GetNodesRectRequest, IRect> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetNodesRectRequest): IRect {
    return RectExtensions.union(this.getNodesRects());
  }

  private getNodesRects(): IRect[] {
    return this.getNodes().map((x) => {
      const rect = RectExtensions.fromElement(x.hostElement);
      return RectExtensions.initialize(x.position.x, x.position.y, rect.width, rect.height);
    })
  }

  private getNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }
}
