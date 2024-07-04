import { IRect, RectExtensions } from '@foblex/core';
import { GetNodesRectRequest } from './get-nodes-rect.request';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '../../infrastructure';

@Injectable()
@FExecutionRegister(GetNodesRectRequest)
export class GetNodesRectExecution implements IExecution<GetNodesRectRequest, IRect> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetNodesRectRequest): IRect {
    const fNodes = this.fComponentsStore.fNodes;
    const rects = fNodes.map((x) => {
      return RectExtensions.fromElement(x.hostElement);
    });
    return RectExtensions.union(rects);
  }
}
