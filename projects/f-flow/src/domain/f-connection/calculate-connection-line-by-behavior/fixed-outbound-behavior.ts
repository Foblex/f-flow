import { ILine, IPoint, IRect, Line, Point } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior.request';
import { EFConnectableSide } from '../../../f-connectors';

export function fixedOutboundBehavior(payload: CalculateConnectionLineByBehaviorRequest): ILine {
  return new Line(
    positions[ payload.outputSide === EFConnectableSide.AUTO ? EFConnectableSide.BOTTOM : payload.outputSide ](payload.outputRect),
    positions[ payload.inputSide === EFConnectableSide.AUTO ? EFConnectableSide.TOP : payload.inputSide ](payload.inputRect)
  );
}

const positions = {
  [ EFConnectableSide.TOP ]: (rect: IRect): IPoint => {
    const result = new Point();
    result.y = rect.y;
    result.x = rect.x + rect.width / 2;
    return result;
  },
  [ EFConnectableSide.BOTTOM ]: (rect: IRect): IPoint => {
    const result = new Point();
    result.y = rect.y + rect.height;
    result.x = rect.x + rect.width / 2;
    return result;
  },
  [ EFConnectableSide.LEFT ]: (rect: IRect): IPoint => {
    const result = new Point();
    result.x = rect.x;
    result.y = rect.y + rect.height / 2;
    return result;
  },
  [ EFConnectableSide.RIGHT ]: (rect: IRect): IPoint => {
    const result = new Point();
    result.x = rect.x + rect.width;
    result.y = rect.y + rect.height / 2;
    return result;
  },
};




