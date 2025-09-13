import { ILine } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior-request';

/**
 * Fixed center behavior calculates the connection line
 * It constructs a line between the gravity centers of the connector rectangles
 * @param payload
 */
export function fixedCenterBehavior({
  sourceRect,
  targetRect,
}: CalculateConnectionLineByBehaviorRequest): ILine {
  return {
    point1: sourceRect.gravityCenter,
    point2: targetRect.gravityCenter,
  };
}
