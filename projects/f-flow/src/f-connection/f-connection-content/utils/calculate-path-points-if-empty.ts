import { ILine, IPoint } from '@foblex/2d';
import { IFConnectionBuilderResponse } from '../../f-connection-builder';

export function calculatePathPointsIfEmpty(
  line: ILine,
  { secondPoint, connectionCenter, penultimatePoint }: IFConnectionBuilderResponse,
): IPoint[] {
  return [
    line.point1,
    secondPoint || line.point1,
    connectionCenter,
    penultimatePoint || line.point2,
    line.point2,
  ];
}
