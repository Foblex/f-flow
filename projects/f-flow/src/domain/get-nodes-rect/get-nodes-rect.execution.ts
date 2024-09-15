import { IRect, RectExtensions } from '@foblex/2d';
import { GetNodesRectRequest } from './get-nodes-rect.request';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../f-node';

@Injectable()
@FExecutionRegister(GetNodesRectRequest)
export class GetNodesRectExecution implements IExecution<GetNodesRectRequest, IRect | null> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetNodesRectRequest): IRect | null {
    return RectExtensions.union(this.getNodesRects());
  }

  private getNodesRects(): IRect[] {
    return this.getNodes().map((x) => RectExtensions.fromElement(x.hostElement));
  }

  private getNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }
}
