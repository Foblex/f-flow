import {
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '../../models';
import { buildConnectionAnchors } from '../utils';
import { IControlPointCandidate } from '../../../../components';

const EPS = 0.0002;

export class CalculateStraightLineData implements IFConnectionBuilder {
  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const anchors = buildConnectionAnchors(request.source, request.target, request.pivots);

    const n = anchors.length;

    const p0 = anchors[0];
    let d = `M ${p0.x} ${p0.y}`;

    const candidates: IControlPointCandidate[] = new Array(n - 1);

    for (let i = 0; i < n - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];

      const isLast = i === n - 2;
      const bx = isLast ? b.x + EPS : b.x;
      const by = isLast ? b.y + EPS : b.y;

      d += ` L ${bx} ${by}`;

      candidates[i] = {
        point: { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 },
        chainIndex: i,
      };
    }

    return {
      path: d,
      candidates,
      points: anchors,
      secondPoint: anchors[1] ?? request.target,
      penultimatePoint: anchors[n - 2] ?? request.source,
    };
  }
}
