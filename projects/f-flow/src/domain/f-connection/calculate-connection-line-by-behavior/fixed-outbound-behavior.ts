import { ILine, IPoint, IRect } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior.request';
import { EFConnectableSide } from '../../../f-connectors';

export function fixedOutboundBehavior(payload: CalculateConnectionLineByBehaviorRequest): ILine {
  return {
    point1: _getPosition(
      payload.outputRect,
      payload.outputSide === EFConnectableSide.AUTO ? EFConnectableSide.BOTTOM : payload.outputSide
    ),
    point2: _getPosition(
      payload.inputRect,
      payload.inputSide === EFConnectableSide.AUTO ? EFConnectableSide.TOP : payload.inputSide
    )
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
      throw new Error(`Unknown side: ${ side }`);
  }
}




