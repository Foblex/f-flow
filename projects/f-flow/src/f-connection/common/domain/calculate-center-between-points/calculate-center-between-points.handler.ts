import { IHandler, IPoint, PointExtensions } from '@foblex/core';
import { CalculateCenterBetweenPointsRequest } from './calculate-center-between-points-request';

export class CalculateCenterBetweenPointsHandler
    implements IHandler<CalculateCenterBetweenPointsRequest, IPoint> {

  public handle(request: CalculateCenterBetweenPointsRequest): IPoint {
    const { source, target } = request;

    const offsetX = Math.abs(target.x - source.x) / 2;
    const centerX = (target.x < source.x) ? target.x + offsetX : target.x - offsetX;

    const offsetY = Math.abs(target.y - source.y) / 2;
    const centerY = (target.y < source.y) ? target.y + offsetY : target.y - offsetY;

    return PointExtensions.initialize(centerX, centerY);
  }
}
