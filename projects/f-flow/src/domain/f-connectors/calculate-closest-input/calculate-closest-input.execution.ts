import { CalculateClosestInputRequest } from './calculate-closest-input.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { IClosestInput } from '../i-closest-input';
import { IConnectorAndRect } from '../index';

@Injectable()
@FExecutionRegister(CalculateClosestInputRequest)
export class CalculateClosestInputExecution
  implements IExecution<CalculateClosestInputRequest, IClosestInput | undefined> {

  public handle(payload: CalculateClosestInputRequest): IClosestInput | undefined {
    let result: IConnectorAndRect | undefined;
    let minDistance = Infinity;

    for (const element of payload.canBeConnectedInputs) {
      const distance = this._distanceToRectangle(payload.position, element);

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

  private _distanceToRectangle(point: IPoint, inputWithRect: IConnectorAndRect): number {
    const closestX = this._clamp(point.x, inputWithRect.fRect.x, inputWithRect.fRect.x + inputWithRect.fRect.width);
    const closestY = this._clamp(point.y, inputWithRect.fRect.y, inputWithRect.fRect.y + inputWithRect.fRect.height);

    const dx = point.x - closestX;
    const dy = point.y - closestY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private _clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
