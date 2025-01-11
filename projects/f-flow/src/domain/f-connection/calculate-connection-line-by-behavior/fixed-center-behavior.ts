import { ILine, Line } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior.request';

export function fixedCenterBehavior(payload: CalculateConnectionLineByBehaviorRequest): ILine {
  return new Line(
    payload.outputRect.gravityCenter,
    payload.inputRect.gravityCenter
  );
}
