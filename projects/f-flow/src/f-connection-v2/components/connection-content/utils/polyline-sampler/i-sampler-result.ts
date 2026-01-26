import { ITangent } from './i-tangent';
import { IPoint } from '@foblex/2d';

/** Result of sampling the path. */
export interface ISamplerResult {
  /** Interpolated point on the polyline. */
  point: IPoint;
  /** Unit tangent (segment direction) at that point. */
  tangent: ITangent;
  /** Whether the result was clamped to the path edge (start or end). */
  atEdge: boolean;
}
