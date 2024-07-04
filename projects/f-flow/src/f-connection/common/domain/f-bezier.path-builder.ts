import { IPoint } from '@foblex/core';
import { EFConnectableSide } from '../../../f-connectors';
import { CalculateConnectionCenterHandler, CalculateConnectionCenterRequest } from './calculate-connection-center';
import {
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse
} from '../../f-connection-builder';

export class FBezierPathBuilder implements IFConnectionBuilder {

  private static getConnectorOffset(distance: number, offset: number): number {
    if (distance >= offset) {
      return distance;
    }
    return offset * Math.sqrt(offset - distance);
  }

  private static getAnglePoint(side: EFConnectableSide, source: IPoint, target: IPoint, offset: number): IPoint {

    let result: IPoint = { x: source.x, y: source.y };

    switch (side) {
      case EFConnectableSide.LEFT:
        result.x -= FBezierPathBuilder.getConnectorOffset(source.x - target.x, offset);
        break;
      case EFConnectableSide.RIGHT:
        result.x += FBezierPathBuilder.getConnectorOffset(target.x - source.x, offset);
        break;
      case EFConnectableSide.TOP:
        result.y -= FBezierPathBuilder.getConnectorOffset(source.y - target.y, offset);
        break;
      case EFConnectableSide.BOTTOM:
        result.y += FBezierPathBuilder.getConnectorOffset(target.y - source.y, offset);
        break;
    }

    return result;
  }

  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const { source, sourceSide, target, targetSide, offset } = request;

    const sourceAnglePoint = FBezierPathBuilder.getAnglePoint(sourceSide, source, target, offset);

    const targetAnglePoint = FBezierPathBuilder.getAnglePoint(targetSide, target, source, offset);

    const path = `M ${ source.x } ${ source.y } C ${ sourceAnglePoint.x } ${ sourceAnglePoint.y }, ${ targetAnglePoint.x } ${ targetAnglePoint.y }, ${ target.x + 0.0002 } ${ target.y + 0.0002 }`;

    const connectionCenter = new CalculateConnectionCenterHandler().handle(
      new CalculateConnectionCenterRequest([ source, sourceAnglePoint, targetAnglePoint, target ])
    );

    return { path, connectionCenter };
  }
}
