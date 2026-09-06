import { IPoint } from '@foblex/2d';

export interface IFConnectionBuilderResponse {
  path: string;

  penultimatePoint: IPoint;

  secondPoint: IPoint;

  points: IPoint[];

  candidates: IPoint[];

  /**
   * Display positions for the waypoint handles, aligned index-wise with the
   * request waypoints. A builder provides them when the rendered path does not
   * pass exactly through a waypoint (for example a rounded segment corner cuts
   * inside it) so the handle can be drawn on the visible line. When omitted,
   * handles are drawn at the waypoints themselves.
   */
  waypointHandles?: IPoint[];
}
