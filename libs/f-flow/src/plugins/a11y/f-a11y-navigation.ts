import { IRect } from '@foblex/2d';

export type FA11yDirection = 'up' | 'down' | 'left' | 'right';

/** A spatial-navigation stop: a node or a connection midpoint, with its canvas rect. */
export interface IFA11yNavigable {
  id: string;
  rect: IRect;
}

/**
 * Off-axis edge distance costs double, so "right" prefers an item truly to the right
 * over one that is mostly above/below — but a near diagonal neighbor still beats a
 * far straight one, which is what users expect on a sparse canvas (a strict
 * straight-sector priority, as in TV-grid navigation, jumps across the whole graph).
 */
const ORTHOGONAL_WEIGHT = 2;

/**
 * Nearest candidate in the given direction, measured between facing EDGES rather than
 * centers — a wide or tall neighbor that starts right next to the origin wins over a
 * small one whose center happens to be closer. A candidate qualifies when its
 * `gravityCenter` lies ahead of the origin's along the direction; its score is the
 * facing-edge gap plus the doubled off-axis edge gap (zero while the candidate
 * overlaps the origin's row/column band), with the plain center distance as the
 * tie-breaker.
 *
 * `preferredId` implements return-to-source: when set and qualifying, it wins outright,
 * so pressing the opposite arrow goes back to where you came from.
 */
export function findSpatialNeighbor(
  origin: IRect,
  candidates: IFA11yNavigable[],
  direction: FA11yDirection,
  preferredId?: string,
): IFA11yNavigable | undefined {
  let best: IFA11yNavigable | undefined;
  let bestScore = Infinity;
  let bestTieBreak = Infinity;

  for (const candidate of candidates) {
    if (!isAhead(candidate.rect, origin, direction)) {
      continue;
    }

    if (candidate.id === preferredId) {
      return candidate;
    }

    const score =
      alongEdgeGap(candidate.rect, origin, direction) +
      orthogonalEdgeGap(candidate.rect, origin, direction) * ORTHOGONAL_WEIGHT;
    const tieBreak = Math.hypot(
      candidate.rect.gravityCenter.x - origin.gravityCenter.x,
      candidate.rect.gravityCenter.y - origin.gravityCenter.y,
    );

    if (score < bestScore || (score === bestScore && tieBreak < bestTieBreak)) {
      bestScore = score;
      bestTieBreak = tieBreak;
      best = candidate;
    }
  }

  return best;
}

function isAhead(rect: IRect, origin: IRect, direction: FA11yDirection): boolean {
  switch (direction) {
    case 'left':
      return rect.gravityCenter.x < origin.gravityCenter.x;
    case 'right':
      return rect.gravityCenter.x > origin.gravityCenter.x;
    case 'up':
      return rect.gravityCenter.y < origin.gravityCenter.y;
    case 'down':
      return rect.gravityCenter.y > origin.gravityCenter.y;
  }
}

/** Gap between the facing edges along the direction of travel, clamped at zero. */
function alongEdgeGap(rect: IRect, origin: IRect, direction: FA11yDirection): number {
  switch (direction) {
    case 'left':
      return Math.max(0, origin.x - (rect.x + rect.width));
    case 'right':
      return Math.max(0, rect.x - (origin.x + origin.width));
    case 'up':
      return Math.max(0, origin.y - (rect.y + rect.height));
    case 'down':
      return Math.max(0, rect.y - (origin.y + origin.height));
  }
}

/** Distance from the origin's row/column band across the direction; zero when overlapping. */
function orthogonalEdgeGap(rect: IRect, origin: IRect, direction: FA11yDirection): number {
  if (direction === 'left' || direction === 'right') {
    if (rect.y + rect.height < origin.y) {
      return origin.y - (rect.y + rect.height);
    }
    if (rect.y > origin.y + origin.height) {
      return rect.y - (origin.y + origin.height);
    }

    return 0;
  }

  if (rect.x + rect.width < origin.x) {
    return origin.x - (rect.x + rect.width);
  }
  if (rect.x > origin.x + origin.width) {
    return rect.x - (origin.x + origin.width);
  }

  return 0;
}
