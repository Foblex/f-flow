import { inject, Injectable } from '@angular/core';
import { GetNodePaddingRequest } from './get-node-padding.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';

/**
 * Execution that retrieves the padding data of a Node.
 * If a childrenArea is set, calculates the offset from the node bounds to the children area bounds.
 * If the Node does not include padding, it returns [0, 0, 0, 0].
 */
@Injectable()
@FExecutionRegister(GetNodePaddingRequest)
export class GetNodePadding
  implements IExecution<GetNodePaddingRequest, [ number, number, number, number ]> {

  private readonly _browser = inject(BrowserService);

  public handle(request: GetNodePaddingRequest): [ number, number, number, number ] {
    if (!request.fNode.fIncludePadding()) {
      return [ 0, 0, 0, 0 ];
    }

    // If a children area is set, calculate offset from node bounds to children area bounds
    if (request.fNode.childrenArea) {
      return this._getChildrenAreaOffset(request.fNode, request.rect);
    }

    // Fall back to CSS padding
    return this._getPaddingData(request.fNode, request.rect);
  }

  private _getChildrenAreaOffset(node: FNodeBase, _nodeRect: IRect): [ number, number, number, number ] {
    const childrenAreaElement = node.childrenArea!.hostElement;
    const childrenAreaRect = childrenAreaElement.getBoundingClientRect();
    const nodeElementRect = node.hostElement.getBoundingClientRect();

    // Calculate the offset from node bounds to children area bounds
    // The offset is [left, top, right, bottom]
    const left = childrenAreaRect.left - nodeElementRect.left;
    const top = childrenAreaRect.top - nodeElementRect.top;
    const right = nodeElementRect.right - childrenAreaRect.right;
    const bottom = nodeElementRect.bottom - childrenAreaRect.bottom;

    return [ left, top, right, bottom ];
  }

  private _getPaddingData(node: FNodeBase, rect: IRect): [ number, number, number, number ] {
    const style = this._browser.window.getComputedStyle(node.hostElement);

    return [
      this._browser.toPixels(style.paddingLeft, rect.width, rect.height, style.fontSize),
      this._browser.toPixels(style.paddingTop, rect.width, rect.height, style.fontSize),
      this._browser.toPixels(style.paddingRight, rect.width, rect.height, style.fontSize),
      this._browser.toPixels(style.paddingBottom, rect.width, rect.height, style.fontSize),
    ];
  }
}
