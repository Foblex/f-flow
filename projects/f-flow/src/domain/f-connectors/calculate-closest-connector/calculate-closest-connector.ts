import { CalculateClosestConnectorRequest } from './calculate-closest-connector-request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { IClosestConnector } from '../i-closest-connector';
import { IConnectorAndRect } from '../index';

/**
 * Execution that finds the closest connector to a given point.
 * It calculates the distance from the point to each connector's rectangle
 * and returns the closest one along with its distance.
 */
@Injectable()
@FExecutionRegister(CalculateClosestConnectorRequest)
export class CalculateClosestConnector
  implements IExecution<CalculateClosestConnectorRequest, IClosestConnector | undefined>
{
  public handle({
    position,
    connectors,
  }: CalculateClosestConnectorRequest): IClosestConnector | undefined {
    let result: IConnectorAndRect | undefined;
    let minDistance = Infinity;

    for (const element of connectors) {
      const distance = this._distanceToRectangle(position, element);

      if (distance < minDistance) {
        minDistance = distance;
        result = element;
      }
    }

    return result
      ? {
          ...result,
          distance: minDistance,
        }
      : undefined;
  }

  private _distanceToRectangle(point: IPoint, inputWithRect: IConnectorAndRect): number {
    const closestX = this._clamp(
      point.x,
      inputWithRect.fRect.x,
      inputWithRect.fRect.x + inputWithRect.fRect.width,
    );
    const closestY = this._clamp(
      point.y,
      inputWithRect.fRect.y,
      inputWithRect.fRect.y + inputWithRect.fRect.height,
    );

    const dx = point.x - closestX;
    const dy = point.y - closestY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private _clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
