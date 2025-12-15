import { IPoint } from '@foblex/2d';
import {
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '../../f-connection-builder';
import {
  CalculateConnectionCenterHandler,
  CalculateConnectionCenterRequest,
} from './calculate-connection-center';

/**
 * Custom path builder that allows users to define connection paths using draggable control points.
 * This builder is useful for industrial diagrams like P&ID, circuit diagrams, and process flow diagrams
 * where precise manual positioning of connection paths is required.
 */
export class FCustomPathBuilder implements IFConnectionBuilder {
  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const { source, target, controlPoints, radius } = request;

    // If no control points are provided, create a simple straight path
    const points = this._getPathPoints(source, target, controlPoints || []);

    // Build the path with rounded corners based on radius
    const path = this._buildPath(points, radius);

    // Calculate the center point for the connection
    const center = new CalculateConnectionCenterHandler().handle(
      new CalculateConnectionCenterRequest(points),
    );

    // Get penultimate and second points for drag handles
    const penultimatePoint = points.length > 1 ? points[points.length - 2] : source;
    const secondPoint = points.length > 1 ? points[1] : target;

    return {
      path,
      connectionCenter: center,
      penultimatePoint,
      secondPoint,
      points,
    };
  }

  private _getPathPoints(source: IPoint, target: IPoint, controlPoints: IPoint[]): IPoint[] {
    // Combine source, control points, and target into a single array
    return [source, ...controlPoints, target];
  }

  private _buildPath(points: IPoint[], borderRadius: number): string {
    if (points.length < 2) {
      return '';
    }

    let path = '';
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      let segment = '';

      if (i > 0 && i < points.length - 1 && borderRadius > 0) {
        // Apply rounded corner at intermediate points
        segment = this._getBend(points[i - 1], p, points[i + 1], borderRadius);
      } else if (i === points.length - 1) {
        // Last point - add small offset to ensure proper rendering
        segment = this._buildLastLineSegment(i, p);
      } else {
        // First point or no border radius
        segment = this._buildMoveOrLineSegment(i, p);
      }
      path += segment;
    }

    return path;
  }

  private _distance(a: IPoint, b: IPoint): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  private _getBend(a: IPoint, b: IPoint, c: IPoint, size: number): string {
    const bendSize = Math.min(this._distance(a, b) / 2, this._distance(b, c) / 2, size);
    const { x, y } = b;

    // Check if points are collinear (no bend needed)
    if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
      return `L${x} ${y}`;
    }

    // Calculate the direction vectors
    const dx1 = x - a.x;
    const dy1 = y - a.y;
    const dx2 = c.x - x;
    const dy2 = c.y - y;

    // Normalize the vectors
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    if (len1 === 0 || len2 === 0) {
      return `L${x} ${y}`;
    }

    const ndx1 = dx1 / len1;
    const ndy1 = dy1 / len1;
    const ndx2 = dx2 / len2;
    const ndy2 = dy2 / len2;

    // Calculate control points for the curve
    const p1x = x - ndx1 * bendSize;
    const p1y = y - ndy1 * bendSize;
    const p2x = x + ndx2 * bendSize;
    const p2y = y + ndy2 * bendSize;

    return `L ${p1x},${p1y}Q ${x},${y} ${p2x},${p2y}`;
  }

  private _buildMoveOrLineSegment(index: number, point: IPoint): string {
    return `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`;
  }

  private _buildLastLineSegment(index: number, point: IPoint): string {
    // Add small offset to ensure proper rendering
    return `L${point.x + 0.0002} ${point.y + 0.0002}`;
  }
}
