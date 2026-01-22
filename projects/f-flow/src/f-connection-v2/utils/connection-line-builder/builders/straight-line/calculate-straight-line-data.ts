import {
  IFConnectionBuilderResponse,
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
} from '../../models';
import { buildConnectionAnchors } from '../utils';
import { IPoint } from '@foblex/2d';
import { IControlPointCandidate } from '../../../../components';

export class CalculateStraightLineData implements IFConnectionBuilder {
  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const anchors = buildConnectionAnchors(request.source, request.target, request.pivots);

    const segmentPaths: string[] = [];

    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];

      const path = createStraightSegmentPath(a, b, i === anchors.length - 2);
      segmentPaths.push(path);
    }

    const d = joinSegmentPaths(segmentPaths);

    return {
      path: d,
      candidates: buildSegmentCandidates(anchors),
      points: anchors,
      secondPoint: anchors[1] ?? request.target,
      penultimatePoint: anchors[anchors.length - 2] ?? request.source,
    };
  }
}

function createStraightSegmentPath(a: IPoint, b: IPoint, isLast: boolean): string {
  const x = isLast ? b.x + 0.0002 : b.x;
  const y = isLast ? b.y + 0.0002 : b.y;

  return `M ${a.x} ${a.y} L ${x} ${y}`;
}

function buildSegmentCandidates(anchors: IPoint[]): IControlPointCandidate[] {
  const out: IControlPointCandidate[] = [];
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    out.push({
      point: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      chainIndex: i,
      kind: 'mid-segment',
    });
  }

  return out;
}

function joinSegmentPaths(segments: string[]): string {
  let d = segments[0];

  for (let i = 1; i < segments.length; i++) {
    d += ' ' + segments[i];
  }

  return d;
}
