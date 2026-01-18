import { createStraightLinePath } from './create-straight-line-path';
import {
  IFConnectionBuilderResponse,
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
} from '../../models';
import { IControlPointCandidate } from '../../../../components';
import { calculateUserAnchorPoints } from '../utils';

export class CalculateStraightLineData implements IFConnectionBuilder {
  public handle({
    source,
    pivots,
    target,
  }: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const anchors = [source, ...calculateUserAnchorPoints(pivots), target];

    const candidates: IControlPointCandidate[] = [];
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      candidates.push({
        point: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        chainIndex: i,
        kind: 'mid-segment',
      });
    }

    return {
      path: createStraightLinePath(anchors),
      secondPoint: anchors[1] ?? target,
      penultimatePoint: anchors[anchors.length - 2] ?? source,
      points: anchors,
      candidates,
    };
  }
}

// export class CalculateStraightLineData implements IFConnectionBuilder {
//   public handle({
//                   source,
//                   pivots,
//                   target,
//                 }: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
//     const polyline = [source, ...calculateUserAnchors(pivots), target];
//
//     return {
//       path: createStraightLinePath(polyline),
//       penultimatePoint: polyline[points.length - 2],
//       secondPoint: polyline[1] ?? target,
//       points,
//     };
//   }
// }
