import { IPoint } from '../../../../../_libs/f-2d';

export function buildConnectionAnchors(
  source: IPoint,
  target: IPoint,
  waypoints?: IPoint[],
): IPoint[] {
  return [source, ...(waypoints ?? []), target];
}
