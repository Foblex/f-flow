import { IPoint } from '@foblex/2d';
import { ConnectionContentAlign } from '../models';

function normalize180(angleDeg: number): number {
  let a = (angleDeg + 180) % 360;
  if (a < 0) a += 360;

  return a - 180;
}

function keepUpright(angleDeg: number): number {
  let a = normalize180(angleDeg);
  if (a > 90) a -= 180;
  else if (a < -90) a += 180;

  return a;
}

export function calculateConnectionContentRotation(align: ConnectionContentAlign, tangent: IPoint) {
  let result = 0;

  if (align === ConnectionContentAlign.ALONG) {
    result = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
    result = keepUpright(result);
  }

  return result;
}
