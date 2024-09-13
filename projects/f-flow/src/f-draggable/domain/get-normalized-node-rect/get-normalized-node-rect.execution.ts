import { Injectable } from '@angular/core';
import { GetNormalizedNodeRectRequest } from './get-normalized-node-rect.request';
import { IPoint, IRect, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(GetNormalizedNodeRectRequest)
export class GetNormalizedNodeRectExecution
  implements IExecution<GetNormalizedNodeRectRequest, IRect> {

  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: GetNormalizedNodeRectRequest): IRect {
    return this.normalizeRect(RectExtensions.fromElement(request.fNode.hostElement), request.fNode.position);
  }

  private normalizeRect(scaledRect: IRect, position: IPoint): IRect {
    const rect = RectExtensions.div(scaledRect, this.fComponentsStore.fCanvas!.transform.scale);

    return RectExtensions.initialize(position.x, position.y, rect.width, rect.height);
  }
}
