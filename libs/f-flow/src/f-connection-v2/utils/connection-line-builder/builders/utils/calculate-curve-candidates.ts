import { ICubicSegment } from './multi-cubic';
import { cubicBezierAtT } from './sample-cubic-bezier-uniform';
import { IPoint } from '@foblex/2d';

export function calculateCurveCandidates(segments: ICubicSegment[]): IPoint[] {
  return segments.map((s) => {
    return cubicBezierAtT(s.p0, s.c1, s.c2, s.p3, 0.5);
  });
}
