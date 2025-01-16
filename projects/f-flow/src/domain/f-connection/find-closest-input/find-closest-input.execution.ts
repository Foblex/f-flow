import { FindClosestInputRequest } from './find-closest-input.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { IConnectorWithRect } from '../get-connector-with-rect';
import { IClosestInput } from './i-closest-input';

@Injectable()
@FExecutionRegister(FindClosestInputRequest)
export class FindClosestInputExecution
  implements IExecution<FindClosestInputRequest, IClosestInput | undefined> {

  public handle(payload: FindClosestInputRequest): IClosestInput | undefined {
    let result: IConnectorWithRect | undefined;
    let minDistance = Infinity;

    for (const element of payload.canBeConnectedInputs) {
      const distance = this.distanceToRectangle(payload.position, element);

      if (distance < minDistance) {
        minDistance = distance;
        result = element;
      }
    }

    return result ? {
      ...result,
      distance: minDistance,
    } : undefined;
  }

  private distanceToRectangle(point: IPoint, inputWithRect: IConnectorWithRect): number {
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
