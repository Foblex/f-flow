import { IRect } from '@foblex/core';
import { INearestCoordinateResult } from './i-nearest-coordinate-result';

/**
 * A class to find the nearest coordinate.
 */
export class NearestCoordinateFinder {


  private elements: IRect[];
  private target: IRect;

  /**
   * Constructor to initialize the NearestCoordinateFinder.
   * @param elements - The array of IRect elements.
   * @param target - The target IRect element.
   * @param alignThreshold - The threshold to align the elements.
   */
  constructor(elements: IRect[], target: IRect, private alignThreshold: number = 10) {
    this.elements = elements;
    this.target = target;
  }

  /**
   * Finds the nearest coordinate on a specified axis.
   * @returns The nearest coordinate and its distance.
   */
  public findNearestCoordinateByX(): INearestCoordinateResult {
    let nearest: number | undefined;
    let minDistance: number | undefined;

    for (const element of this.elements) {
      const distanceLeftLeft = this.target.x - element.x;
      const distanceLeftRight = this.target.x - (element.x + element.width);
      const distanceCenterCenter = this.target.gravityCenter.x - element.gravityCenter.x;
      const distanceRightLeft = (this.target.x + this.target.width) - element.x;
      const distanceRightRight = (this.target.x + this.target.width) - (element.x + element.width);

      if (
          Math.abs(distanceLeftLeft) <= this.alignThreshold ||
          Math.abs(distanceLeftRight) <= this.alignThreshold ||
          Math.abs(distanceCenterCenter) <= this.alignThreshold ||
          Math.abs(distanceRightLeft) <= this.alignThreshold ||
          Math.abs(distanceRightRight) <= this.alignThreshold
      ) {
        if (minDistance === undefined || Math.abs(distanceCenterCenter) < Math.abs(minDistance)) {
          minDistance = distanceCenterCenter;
          nearest = element.gravityCenter.x;
        }
        if (Math.abs(distanceLeftLeft) < Math.abs(minDistance)) {
          minDistance = distanceLeftLeft;
          nearest = element.x;
        }
        if (Math.abs(distanceRightRight) < Math.abs(minDistance)) {
          minDistance = distanceRightRight;
          nearest = element.x + element.width;
        }
        if (Math.abs(distanceLeftRight) < Math.abs(minDistance)) {
          minDistance = distanceLeftRight;
          nearest = element.x + element.width;
        }
        if (Math.abs(distanceRightLeft) < Math.abs(minDistance)) {
          minDistance = distanceRightLeft;
          nearest = element.x;
        }
      }
    }
    return { value: nearest, distance: minDistance };
  }


  /**
   * Finds the nearest coordinate on a specified axis.
   * @returns The nearest coordinate and its distance.
   */
  public findNearestCoordinateByY(): INearestCoordinateResult {
    let nearest: number | undefined;
    let minDistance: number | undefined;

    for (const element of this.elements) {
      const distanceTopTop = this.target.y - element.y;
      const distanceTopBottom = this.target.y - (element.y + element.height);
      const distanceCenterCenter = this.target.gravityCenter.y - element.gravityCenter.y;
      const distanceBottomTop = (this.target.y + this.target.height) - element.y;
      const distanceBottomBottom = (this.target.y + this.target.height) - (element.y + element.height);

      if (
          Math.abs(distanceTopTop) <= this.alignThreshold ||
          Math.abs(distanceTopBottom) <= this.alignThreshold ||
          Math.abs(distanceCenterCenter) <= this.alignThreshold ||
          Math.abs(distanceBottomTop) <= this.alignThreshold ||
          Math.abs(distanceBottomBottom) <= this.alignThreshold
      ) {
        if (minDistance === undefined || Math.abs(distanceCenterCenter) < Math.abs(minDistance)) {
          minDistance = distanceCenterCenter;
          nearest = element.gravityCenter.y;
        }
        if (Math.abs(distanceTopTop) < Math.abs(minDistance)) {
          minDistance = distanceTopTop;
          nearest = element.y;
        }
        if (Math.abs(distanceBottomBottom) < Math.abs(minDistance)) {
          minDistance = distanceBottomBottom;
          nearest = element.y + element.height;
        }
        if (Math.abs(distanceTopBottom) < Math.abs(minDistance)) {
          minDistance = distanceTopBottom;
          nearest = element.y + element.height;
        }
        if (Math.abs(distanceBottomTop) < Math.abs(minDistance)) {
          minDistance = distanceBottomTop;
          nearest = element.y;
        }
      }
    }

    return { value: nearest, distance: minDistance };
  }
}

