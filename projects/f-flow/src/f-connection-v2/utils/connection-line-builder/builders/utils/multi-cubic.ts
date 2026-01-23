import { IPoint } from '@foblex/2d';
import { sampleCubicBezierUniform } from './sample-cubic-bezier-uniform';

export interface ICubicSegment {
  p0: IPoint;
  c1: IPoint;
  c2: IPoint;
  p3: IPoint;
  chainIndex: number;
}

export function createMultiCubicPath(segments: ICubicSegment[]): string {
  if (!segments.length) return '';
  let d = `M ${segments[0].p0.x} ${segments[0].p0.y}`;

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const isLast = i === segments.length - 1;

    const x = isLast ? s.p3.x + 0.0002 : s.p3.x;
    const y = isLast ? s.p3.y + 0.0002 : s.p3.y;

    d += ` C ${s.c1.x} ${s.c1.y}, ${s.c2.x} ${s.c2.y}, ${x} ${y}`;
  }

  return d;
}

export function sampleMultiCubicUniform(
  segments: ICubicSegment[],
  samplesPerSegment = 16,
): IPoint[] {
  if (!segments.length) return [];
  const out: IPoint[] = [];

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const pts = sampleCubicBezierUniform([s.p0, s.c1, s.c2, s.p3], samplesPerSegment);

    if (i > 0) pts.shift();
    out.push(...pts);
  }

  return out;
}
