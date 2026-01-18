import { IPoint } from '@foblex/2d';
import { IControlPoint } from '../../../../components';

export function calculateUserAnchorPoints(pivots?: IControlPoint[]): IPoint[] {
  return (pivots ?? []).filter((p) => p.userDefined).map((p) => p.point);
}
