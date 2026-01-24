import { ICubicSegment } from './multi-cubic';
import { IPivotCandidate } from '../../../../components';
import { cubicBezierAtT } from './sample-cubic-bezier-uniform';

export function calculateCurveCandidates(segments: ICubicSegment[]): IPivotCandidate[] {
  return segments.map((s) => {
    return {
      point: cubicBezierAtT(s.p0, s.c1, s.c2, s.p3, 0.5),
      chainIndex: s.chainIndex,
    };
  });
}
