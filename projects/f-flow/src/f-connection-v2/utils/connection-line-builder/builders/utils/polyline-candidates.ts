import { IPoint } from '@foblex/2d';
import { IControlPointCandidate } from '../../../../components';

export function buildPolylineCandidatesForChain(
  polyline: IPoint[],
  chainIndex: number,
): IControlPointCandidate[] {
  const res: IControlPointCandidate[] = [];
  if (polyline.length < 2) return res;

  // --- bends (внутренние точки, где меняется направление)
  for (let i = 1; i < polyline.length - 1; i++) {
    const a = polyline[i - 1];
    const b = polyline[i];
    const c = polyline[i + 1];

    const dir1x = Math.sign(b.x - a.x);
    const dir1y = Math.sign(b.y - a.y);
    const dir2x = Math.sign(c.x - b.x);
    const dir2y = Math.sign(c.y - b.y);

    if (dir1x !== dir2x || dir1y !== dir2y) {
      res.push({
        point: b,
        chainIndex,
        kind: 'bend',
      });
    }
  }

  // --- midpoints каждого сегмента полилинии
  for (let i = 0; i < polyline.length - 1; i++) {
    const a = polyline[i];
    const b = polyline[i + 1];
    res.push({
      point: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      chainIndex,
      kind: 'mid-segment',
    });
  }

  // (опционально) можно фильтровать слишком близкие к концам
  return uniqueCandidates(res);
}

function uniqueCandidates(list: IControlPointCandidate[]): IControlPointCandidate[] {
  const out: IControlPointCandidate[] = [];
  const key = (p: IPoint) => `${p.x.toFixed(2)}:${p.y.toFixed(2)}`;

  const seen = new Set<string>();
  for (const c of list) {
    const k = `${c.chainIndex}:${c.kind ?? ''}:${key(c.point)}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
  }

  return out;
}
