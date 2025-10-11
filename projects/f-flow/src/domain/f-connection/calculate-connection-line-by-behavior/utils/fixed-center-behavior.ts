import { ILine } from '@foblex/2d';
import { CalculateBehaviorRequest } from '../models/calculate-behavior-request';

/**
 * Fixed center behavior calculates the connection line
 * It constructs a line between the gravity centers of the connector rectangles
 * @param payload
 */
export function fixedCenterBehavior({ sourceRect, targetRect }: CalculateBehaviorRequest): ILine {
  return {
    point1: sourceRect.gravityCenter,
    point2: targetRect.gravityCenter,
  };
}
