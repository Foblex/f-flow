import { Injectable } from '@angular/core';
import { GetNodePaddingRequest } from './get-node-padding.request';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/core';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(GetNodePaddingRequest)
export class GetNodePaddingExecution
  implements IExecution<GetNodePaddingRequest, [ number, number, number, number ]> {

  constructor(
    private fBrowser: BrowserService
  ) {
  }

  public handle(request: GetNodePaddingRequest): [ number, number, number, number ] {
    return request.fNode.fIncludePadding ? this.getPaddingData(request.fNode, request.rect) : [ 0, 0, 0, 0 ];
  }

  private getPaddingData(node: FNodeBase, rect: IRect): [ number, number, number, number ] {
    const style = this.fBrowser.window.getComputedStyle(node.hostElement);
    return [
      this.fBrowser.toPixels(style.paddingLeft, rect.width, rect.height, style.fontSize),
      this.fBrowser.toPixels(style.paddingTop, rect.width, rect.height, style.fontSize),
      this.fBrowser.toPixels(style.paddingRight, rect.width, rect.height, style.fontSize),
      this.fBrowser.toPixels(style.paddingBottom, rect.width, rect.height, style.fontSize)
    ];
  }
}
