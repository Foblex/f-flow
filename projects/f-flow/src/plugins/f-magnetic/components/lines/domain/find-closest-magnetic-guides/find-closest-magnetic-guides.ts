import { IRect } from '@foblex/2d';
import { IMagneticGuidesResult } from './i-magnetic-guides-result';

export function findClosestMagneticGuides(
  elements: IRect[],
  target: IRect,
  alignThreshold: number = 10,
): IMagneticGuidesResult {
  let nearestX: number | undefined;
  let minDistanceX: number | undefined;
  let nearestY: number | undefined;
  let minDistanceY: number | undefined;

  for (const element of elements) {
    const targetCenterX = target.gravityCenter.x;
    const targetCenterY = target.gravityCenter.y;

    const elementRight = element.x + element.width;
    const elementBottom = element.y + element.height;

    const elementDistances = {
      x: [
        { value: element.x, distance: target.x - element.x }, // Left edge
        { value: elementRight, distance: target.x - elementRight }, // Right edge
        { value: element.gravityCenter.x, distance: targetCenterX - element.gravityCenter.x }, // Center
        { value: element.x, distance: target.x + target.width - element.x }, // Right to left
        { value: elementRight, distance: target.x + target.width - elementRight }, // Right to right
      ],
      y: [
        { value: element.y, distance: target.y - element.y }, // Top edge
        { value: elementBottom, distance: target.y - elementBottom }, // Bottom edge
        { value: element.gravityCenter.y, distance: targetCenterY - element.gravityCenter.y }, // Center
        { value: element.y, distance: target.y + target.height - element.y }, // Bottom to top
        { value: elementBottom, distance: target.y + target.height - elementBottom }, // Bottom to bottom
      ],
    };

    for (const { value, distance } of elementDistances.x) {
      if (Math.abs(distance) <= alignThreshold) {
        if (minDistanceX === undefined || Math.abs(distance) < Math.abs(minDistanceX)) {
          minDistanceX = distance;
          nearestX = value;
        }
      }
    }

    for (const { value, distance } of elementDistances.y) {
      if (Math.abs(distance) <= alignThreshold) {
        if (minDistanceY === undefined || Math.abs(distance) < Math.abs(minDistanceY)) {
          minDistanceY = distance;
          nearestY = value;
        }
      }
    }
  }

  return {
    x: { guide: nearestX, delta: minDistanceX },
    y: { guide: nearestY, delta: minDistanceY },
  };
}
