import { IPoint } from '@foblex/2d';
import { IHandler } from '@foblex/mediator';
import { CalculateConnectionCenterRequest } from './calculate-connection-center-request';

export class CalculateConnectionCenterHandler
    implements IHandler<CalculateConnectionCenterRequest, IPoint> {

  public handle(request: CalculateConnectionCenterRequest): IPoint {

    const { points } = request;
    let totalDistance = 0;
    const distances: number[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const distance = this.calculateDistance(points[ i ], points[ i + 1 ]);
      distances.push(distance);
      totalDistance += distance;
    }

    let accumulatedDistance = 0;
    let centerIndex = 0;
    const halfTotalDistance = totalDistance / 2;
    for (let i = 0; i < distances.length; i++) {
      accumulatedDistance += distances[ i ];
      if (accumulatedDistance >= halfTotalDistance) {
        centerIndex = i;
        break;
      }
    }

    const remainingDistanceToCenter = halfTotalDistance - (accumulatedDistance - distances[ centerIndex ]);

    return this.findPointAtDistance(points[ centerIndex ], points[ centerIndex + 1 ], remainingDistanceToCenter);
  }

  private calculateDistance(pointA: IPoint, pointB: IPoint): number {
    return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
  }

  private findPointAtDistance(startPoint: IPoint, endPoint: IPoint, distance: number): IPoint {
    const totalDistance = this.calculateDistance(startPoint, endPoint);
    const ratio = distance / totalDistance;
    const x = (1 - ratio) * startPoint.x + ratio * endPoint.x;
    const y = (1 - ratio) * startPoint.y + ratio * endPoint.y;

    return { x, y };
  }
}
