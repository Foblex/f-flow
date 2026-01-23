import { IPoint } from '@foblex/2d';

export function buildConnectionAnchors(
  source: IPoint,
  target: IPoint,
  pivots?: IPoint[],
): IPoint[] {
  return [source, ...(pivots ?? []), target];
}
