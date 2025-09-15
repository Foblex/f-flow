import {
  CalculateConnectionCenterHandler,
  CalculateConnectionCenterRequest,
} from './calculate-connection-center';
import {
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '../../f-connection-builder';

export class FStraightPathBuilder implements IFConnectionBuilder {
  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const { source, target } = request;
    const path = `M ${source.x} ${source.y} L ${target.x + 0.0002} ${target.y + 0.0002}`;

    const connectionCenter = new CalculateConnectionCenterHandler().handle(
      new CalculateConnectionCenterRequest([source, target]),
    );

    return {
      path,
      connectionCenter,
      penultimatePoint: source,
      secondPoint: target,
      points: [source, connectionCenter, target],
    };
  }
}
