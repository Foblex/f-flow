import { IRect, RectExtensions } from '@foblex/core';
import { GetExternalNodesRectRequest } from './get-external-nodes-rect.request';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { FNodeBase } from '../../f-node';

@Injectable()
@FExecutionRegister(GetExternalNodesRectRequest)
export class GetExternalNodesRectExecution implements IExecution<GetExternalNodesRectRequest, IRect> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetExternalNodesRectRequest): IRect {
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
