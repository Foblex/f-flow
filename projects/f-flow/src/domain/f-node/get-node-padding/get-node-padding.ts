import { inject, Injectable } from '@angular/core';
import { GetNodePaddingRequest } from './get-node-padding.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';

/**
 * Execution that retrieves the padding data of a Node.
 * If the Node does not include padding, it returns [0, 0, 0, 0].
 */
@Injectable()
@FExecutionRegister(GetNodePaddingRequest)
export class GetNodePadding
  implements IExecution<GetNodePaddingRequest, [ number, number, number, number ]> {

  private readonly _browser = inject(BrowserService);

  public handle(request: GetNodePaddingRequest): [ number, number, number, number ] {
    return request.fNode.fIncludePadding() ? this.getPaddingData(request.fNode, request.rect) : [ 0, 0, 0, 0 ];
  }

  private getPaddingData(node: FNodeBase, rect: IRect): [ number, number, number, number ] {
    const style = this._browser.window.getComputedStyle(node.hostElement);

    return [
      this._browser.toPixels(style.paddingLeft, rect.width, rect.height, style.fontSize),
      this._browser.toPixels(style.paddingTop, rect.width, rect.height, style.fontSize),
      this._browser.toPixels(style.paddingRight, rect.width, rect.height, style.fontSize),
      this._browser.toPixels(style.paddingBottom, rect.width, rect.height, style.fontSize),
    ];
  }
}
