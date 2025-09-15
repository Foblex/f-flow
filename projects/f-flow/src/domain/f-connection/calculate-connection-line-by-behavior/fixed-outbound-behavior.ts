import { ILine, IPoint, IRect } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior-request';
import { EFConnectableSide } from '../../../f-connectors';

/**
 * Fixed outbound behavior calculates the connection line
 * It constructs a line between the specified sides of the output and input rectangles
 * @param payload
 */
export function fixedOutboundBehavior({
  sourceRect,
  sourceConnectableSide,
  targetRect,
  targetConnectableSide,
}: CalculateConnectionLineByBehaviorRequest): ILine {
  return {
    point1: _getPosition(
      sourceRect,
      sourceConnectableSide === EFConnectableSide.AUTO
        ? EFConnectableSide.BOTTOM
        : sourceConnectableSide,
    ),
    point2: _getPosition(
      targetRect,
      targetConnectableSide === EFConnectableSide.AUTO
        ? EFConnectableSide.TOP
        : targetConnectableSide,
    ),
  };
}

function _getPosition(rect: IRect, side: EFConnectableSide): IPoint {
  switch (side) {
    case EFConnectableSide.TOP:
      return { x: rect.x + rect.width / 2, y: rect.y };
    case EFConnectableSide.BOTTOM:
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height };
    case EFConnectableSide.LEFT:
      return { x: rect.x, y: rect.y + rect.height / 2 };
    case EFConnectableSide.RIGHT:
      return { x: rect.x + rect.width, y: rect.y + rect.height / 2 };
    default:
      throw new Error(`Unknown side: ${side}`);
  }
}
