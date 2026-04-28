import { IPoint, IRect } from '@foblex/2d';

/**
 * A single node/group position change as computed by the planner.
 *
 * `fromRect` — rect of the candidate before the plan (canvas units).
 * `toRect`   — rect of the candidate after the plan (canvas units).
 *
 * Animators interpolate `fromRect` → `toRect`; synchronous writers apply `toRect` directly.
 */
export interface IReflowShift {
  id: string;
  fromRect: IRect;
  toRect: IRect;
  toPosition: IPoint;
}

/**
 * Output of the planner for a single resize event.
 *
 * `sourceNodeId` — the node that was resized.
 * `shifts`       — zero or more candidate shifts. Empty list means no-op.
 * `deltaEdges`   — per-edge deltas of the resize (canvas units). For
 *   `EDGE_BASED` delta-source these drive candidate shifts directly.
 */
export interface IReflowPlan {
  sourceNodeId: string;
  shifts: IReflowShift[];
  deltaEdges: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const EMPTY_REFLOW_PLAN = (sourceNodeId: string): IReflowPlan => ({
  sourceNodeId,
  shifts: [],
  deltaEdges: { top: 0, right: 0, bottom: 0, left: 0 },
});
