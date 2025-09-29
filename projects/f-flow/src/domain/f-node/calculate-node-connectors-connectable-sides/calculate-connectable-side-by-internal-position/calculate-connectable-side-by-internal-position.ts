import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { CalculateConnectableSideByInternalPositionRequest } from './calculate-connectable-side-by-internal-position-request';
import { EFConnectableSide } from '../../../../f-connectors';
import { RectExtensions } from '@foblex/2d';

/**
 * Execution that calculates the connectable side for a connector
 * based on the internal position of the connector relative to its node host.
 */
@Injectable()
@FExecutionRegister(CalculateConnectableSideByInternalPositionRequest)
export class CalculateConnectableSideByInternalPosition
  implements IExecution<CalculateConnectableSideByInternalPositionRequest, EFConnectableSide>
{
  public handle({
    connector,
  }: CalculateConnectableSideByInternalPositionRequest): EFConnectableSide {
    return this._getSideByDelta(connector.hostElement, connector.fNodeHost);
  }

  /**
   * Determines the side of the connector relative to the node host based on the minimum distance.
   * @param connectorHost
   * @param nodeHost
   * @private
   */
  private _getSideByDelta(
    connectorHost: HTMLElement | SVGElement,
    nodeHost: HTMLElement | SVGElement,
  ): EFConnectableSide {
    let result: EFConnectableSide | undefined;

    const childRect = RectExtensions.fromElement(connectorHost);
    const parentRect = nodeHost.getBoundingClientRect();

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
