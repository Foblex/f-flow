import { ILine } from '@foblex/2d';
import { ICalculateBehaviorRequest } from '../models';

/**
 * Fixed center behavior calculates the connection line
 * It constructs a line between the gravity centers of the connector rectangles
 * @param payload
 */
export function fixedCenterBehavior({ sourceRect, targetRect }: ICalculateBehaviorRequest): ILine {
  return {
    point1: sourceRect.gravityCenter,
    point2: targetRect.gravityCenter,
  };
}
