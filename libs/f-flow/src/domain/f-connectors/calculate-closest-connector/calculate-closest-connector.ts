import { CalculateClosestConnectorRequest } from './calculate-closest-connector-request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IPoint, IRect } from '@foblex/2d';
import { IClosestConnectorRef } from '../i-closest-connector-ref';
import { IConnectorRectRef } from '../index';

/**
 * Finds the closest connector rect to the given point.
 */
@Injectable()
@FExecutionRegister(CalculateClosestConnectorRequest)
export class CalculateClosestConnector
  implements IExecution<CalculateClosestConnectorRequest, IClosestConnectorRef | undefined>
{
  public handle({
    position,
    connectorRefs,
  }: CalculateClosestConnectorRequest): IClosestConnectorRef | undefined {
    let result: IConnectorRectRef | undefined;
    let minDistance = Infinity;

    for (const ref of connectorRefs) {
      const distance = this._distanceToRect(position, ref.rect);

      if (distance < minDistance) {
        minDistance = distance;
        result = ref;
      }
    }

    return result
      ? {
          ...result,
          distance: minDistance,
        }
      : undefined;
  }

  private _distanceToRect(point: IPoint, { x, y, width, height }: IRect): number {
    const closestX = this._clamp(point.x, x, x + width);
    const closestY = this._clamp(point.y, y, y + height);

    const dx = point.x - closestX;
    const dy = point.y - closestY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private _clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
