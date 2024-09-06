import { Injectable } from '@angular/core';
import { GetNodePaddingRequest } from './get-node-padding.request';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/core';
import { ConvertComputedToPixelsRequest } from '../convert-computed-to-pixels';

@Injectable()
@FExecutionRegister(GetNodePaddingRequest)
export class GetNodePaddingExecution
  implements IExecution<GetNodePaddingRequest, [ number, number, number, number ]> {

  constructor(
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: GetNodePaddingRequest): [ number, number, number, number ] {
    return request.fNode.fIncludePadding ? this.getPaddingData(request.fNode, request.rect) : [ 0, 0, 0, 0 ];
  }

  private getPaddingData(node: FNodeBase, rect: IRect): [ number, number, number, number ] {
    const style = window.getComputedStyle(node.hostElement);
    return [
      this.convertToPixels(style.paddingLeft, rect.width, rect.height, style.fontSize),
      this.convertToPixels(style.paddingTop, rect.width, rect.height, style.fontSize),
      this.convertToPixels(style.paddingRight, rect.width, rect.height, style.fontSize),
      this.convertToPixels(style.paddingBottom, rect.width, rect.height, style.fontSize)
    ];
  }

  private convertToPixels(value: string, clientWidth: number, clientHeight: number, fontSize: string): number {
    return this.fMediator.send<number>(new ConvertComputedToPixelsRequest(value, clientWidth, clientHeight, fontSize));
  }
}
