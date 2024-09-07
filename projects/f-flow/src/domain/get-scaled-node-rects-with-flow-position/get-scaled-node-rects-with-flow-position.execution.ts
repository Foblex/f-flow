import { IRect, RectExtensions } from '@foblex/core';
import { GetScaledNodeRectsWithFlowPositionRequest } from './get-scaled-node-rects-with-flow-position.request';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { FNodeBase } from '../../f-node';

@Injectable()
@FExecutionRegister(GetScaledNodeRectsWithFlowPositionRequest)
export class GetScaledNodeRectsWithFlowPositionExecution implements IExecution<GetScaledNodeRectsWithFlowPositionRequest, IRect | null> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetScaledNodeRectsWithFlowPositionRequest): IRect | null {
    return RectExtensions.union(this.getNodesRects());
  }

  private getNodesRects(): IRect[] {
    return this.getNodes().map((x) => {
      const rect = RectExtensions.fromElement(x.hostElement);
      return RectExtensions.initialize(x.position.x, x.position.y, rect.width, rect.height);
    });
  }

  private getNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }
}
