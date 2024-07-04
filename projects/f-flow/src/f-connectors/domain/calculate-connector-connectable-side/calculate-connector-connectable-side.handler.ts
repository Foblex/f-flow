import { IHandler, RectExtensions } from '@foblex/core';
import { CalculateConnectorConnectableSideRequest } from './calculate-connector-connectable-side-request';
import { EFConnectableSide } from '../../e-f-connectable-side';

export class CalculateConnectorConnectableSideHandler
    implements IHandler<CalculateConnectorConnectableSideRequest, EFConnectableSide> {

  public handle(request: CalculateConnectorConnectableSideRequest): EFConnectableSide {
    let result: EFConnectableSide;

    if (request.fConnector._fConnectableSide === EFConnectableSide.AUTO) {
      result = this.getSideByDelta(request.fConnector.hostElement, request.fNodeHost);
    } else {
      result = request.fConnector._fConnectableSide;
    }
    return result;
  }

  private getSideByDelta(fConnectorHost: HTMLElement | SVGElement, fNodeHost: HTMLElement | SVGElement): EFConnectableSide {
    let result: EFConnectableSide;

    const childRect = RectExtensions.fromElement(fConnectorHost);
    const parentRect = fNodeHost.getBoundingClientRect();

    const deltaLeft = childRect.gravityCenter.x - parentRect.left;
    const deltaRight = parentRect.right - childRect.gravityCenter.x;
    const deltaTop = childRect.gravityCenter.y - parentRect.top;
    const deltaBottom = parentRect.bottom - childRect.gravityCenter.y;

    const minDelta = Math.min(deltaLeft, deltaRight, deltaTop, deltaBottom);

    if (minDelta === deltaLeft) {
      result = EFConnectableSide.LEFT;
    } else if (minDelta === deltaRight) {
      result = EFConnectableSide.RIGHT;
    } else if (minDelta === deltaTop) {
      result = EFConnectableSide.TOP;
    } else {
      result = EFConnectableSide.BOTTOM;
    }

    return result;
  }
}
