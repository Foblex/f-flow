import { FindClosestInputUsingSnapThresholdRequest } from './find-closest-input-using-snap-threshold.request';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { IInputWithRect } from '../get-all-can-be-connected-input-positions';

@Injectable()
@FExecutionRegister(FindClosestInputUsingSnapThresholdRequest)
export class FindClosestInputUsingSnapThresholdExecution
  implements IExecution<FindClosestInputUsingSnapThresholdRequest, IInputWithRect | undefined> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator
  ) {
  }

  public handle(payload: FindClosestInputUsingSnapThresholdRequest): IInputWithRect | undefined {
    let result: IInputWithRect | undefined;
    let minDistance = Infinity;

    for (const element of payload.canBeConnectedInputs) {
      const distance = this.distanceToRectangle(payload.position, element);

      if (distance < minDistance) {
        minDistance = distance;
        result = element;
      }
    }

    return minDistance < payload.snapThreshold ? result : undefined;
  }

  private distanceToRectangle(point: IPoint, inputWithRect: IInputWithRect): number {
    const closestX = this.clamp(point.x, inputWithRect.fRect.x, inputWithRect.fRect.x + inputWithRect.fRect.width);
    const closestY = this.clamp(point.y, inputWithRect.fRect.y, inputWithRect.fRect.y + inputWithRect.fRect.height);

    const dx = point.x - closestX;
    const dy = point.y - closestY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
