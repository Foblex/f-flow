import { IControlPoint } from '@foblex/flow';
import { IPoint } from '@foblex/2d';

export function buildConnectionAnchors(
  source: IPoint,
  target: IPoint,
  pivots?: IControlPoint[],
): IPoint[] {
  return [source, ..._calculatePivots(pivots).map((p) => p.point), target];
}

function _calculatePivots(pivots?: IControlPoint[]): IControlPoint[] {
  return (pivots ?? []).filter((p) => p.userDefined);
}
