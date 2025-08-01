import { ILine } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior.request';

/**
 * Fixed center behavior calculates the connection line
 * It constructs a line between the gravity centers of the connector rectangles
 * @param payload
 */
export function fixedCenterBehavior(payload: CalculateConnectionLineByBehaviorRequest): ILine {
  return {
    point1: payload.outputRect.gravityCenter,
    point2: payload.inputRect.gravityCenter
  };
}
