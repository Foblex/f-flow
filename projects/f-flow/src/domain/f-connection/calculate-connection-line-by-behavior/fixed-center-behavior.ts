import { ILine } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior.request';

export function fixedCenterBehavior(payload: CalculateConnectionLineByBehaviorRequest): ILine {
  return {
    point1: payload.outputRect.gravityCenter,
    point2: payload.inputRect.gravityCenter
  };
}
