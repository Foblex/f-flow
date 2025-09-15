import { IPoint } from '@foblex/2d';
import { EFConnectableSide } from '../../../f-connectors';
import {
  CalculateConnectionCenterHandler,
  CalculateConnectionCenterRequest,
} from './calculate-connection-center';
import {
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '../../f-connection-builder';

export class FBezierPathBuilder implements IFConnectionBuilder {
  private static _getConnectorOffset(distance: number, offset: number): number {
    if (distance >= offset) {
      return distance;
    }

    return offset * Math.sqrt(offset - distance);
  }

  private static _getAnglePoint(
    side: EFConnectableSide,
    source: IPoint,
    target: IPoint,
    offset: number,
  ): IPoint {
    const result: IPoint = { x: source.x, y: source.y };

    switch (side) {
      case EFConnectableSide.LEFT:
        result.x -= FBezierPathBuilder._getConnectorOffset(source.x - target.x, offset);
        break;
      case EFConnectableSide.RIGHT:
        result.x += FBezierPathBuilder._getConnectorOffset(target.x - source.x, offset);
        break;
      case EFConnectableSide.TOP:
        result.y -= FBezierPathBuilder._getConnectorOffset(source.y - target.y, offset);
        break;
      case EFConnectableSide.BOTTOM:
        result.y += FBezierPathBuilder._getConnectorOffset(target.y - source.y, offset);
        break;
    }

    return result;
  }

  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const { source, sourceSide, target, targetSide, offset } = request;

    const sourceAnglePoint = FBezierPathBuilder._getAnglePoint(sourceSide, source, target, offset);

    const targetAnglePoint = FBezierPathBuilder._getAnglePoint(targetSide, target, source, offset);

    const path = `M ${source.x} ${source.y} C ${sourceAnglePoint.x} ${sourceAnglePoint.y}, ${targetAnglePoint.x} ${targetAnglePoint.y}, ${target.x + 0.0002} ${target.y + 0.0002}`;

    const connectionCenter = new CalculateConnectionCenterHandler().handle(
      new CalculateConnectionCenterRequest([source, sourceAnglePoint, targetAnglePoint, target]),
    );

    return {
      path,
      connectionCenter,
      penultimatePoint: targetAnglePoint,
      secondPoint: sourceAnglePoint,
      points: _sampleCubic(source, sourceAnglePoint, targetAnglePoint, target, 32),
    };
  }
}

function bez3(p0: IPoint, p1: IPoint, p2: IPoint, p3: IPoint, t: number): IPoint {
  const u = 1 - t,
    tt = t * t,
    uu = u * u,
    uuu = uu * u,
    ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

function _sampleCubic(p0: IPoint, p1: IPoint, p2: IPoint, p3: IPoint, samples = 32): IPoint[] {
  const out: IPoint[] = new Array(samples + 1);
  out[0] = { ...p0 };
  for (let i = 1; i <= samples; i++) {
    out[i] = bez3(p0, p1, p2, p3, i / samples);
  }

  return out;
}
