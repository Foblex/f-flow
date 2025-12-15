import {
  CalculateConnectionCenterHandler,
  CalculateConnectionCenterRequest,
} from './calculate-connection-center';
import {
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '../../f-connection-builder';

const RENDERING_OFFSET = 0.0002; // Prevents SVG rendering artifacts at path endpoints;

export class FStraightPathBuilder implements IFConnectionBuilder {
  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const { source, target } = request;
    const path = `M ${source.x} ${source.y} L ${target.x + RENDERING_OFFSET} ${target.y + RENDERING_OFFSET}`;

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
