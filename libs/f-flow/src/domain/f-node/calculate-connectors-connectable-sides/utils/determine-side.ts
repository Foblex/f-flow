/**
 * Converts allowed sides array to a compact bit mask.
 * If not provided or empty -> all sides allowed.
 */
import { EFConnectableSide } from '../../../../f-connection-v2';

const SNAP_EPS = 2;

enum SideMask {
  NONE = 0,
  LEFT = 1 << 0,
  RIGHT = 1 << 1,
  TOP = 1 << 2,
  BOTTOM = 1 << 3,
  ALL = (1 << 4) - 1,
}

/**
 * Determines final side using ideal side first; if disallowed, picks best fallback.
 * Inputs are numbers to avoid object wrappers on hot path.
 */
export function determineSide(
  selfX: number,
  selfY: number,
  avgX: number,
  avgY: number,
  allowed?: EFConnectableSide[],
): EFConnectableSide {
  const allowedMask = _toSideMask(allowed);

  const dx = avgX - selfX;
  const dy = avgY - selfY;

  const ideal = _pickIdealSide(dx, dy);

  if (_isAllowed(ideal, allowedMask)) {
    return ideal;
  }

  return _pickFallbackSide(dx, dy, allowedMask, ideal);
}

/**
 * Converts allowed sides array to a compact bit mask.
 * If not provided or empty -> all sides allowed.
 */
function _toSideMask(allowed?: EFConnectableSide[]): SideMask {
  if (!allowed || allowed.length === 0) return SideMask.ALL;

  let mask = SideMask.NONE;
  for (let i = 0; i < allowed.length; i++) {
    switch (allowed[i]) {
      case EFConnectableSide.LEFT:
        mask |= SideMask.LEFT;
        break;
      case EFConnectableSide.RIGHT:
        mask |= SideMask.RIGHT;
        break;
      case EFConnectableSide.TOP:
        mask |= SideMask.TOP;
        break;
      case EFConnectableSide.BOTTOM:
        mask |= SideMask.BOTTOM;
        break;
    }
  }

  return mask || SideMask.ALL;
}

/**
 * Picks the "ideal" side based on vector (dx, dy) with hysteresis.
 */
function _pickIdealSide(dx: number, dy: number): EFConnectableSide {
  const ax = dx < 0 ? -dx : dx;
  const ay = dy < 0 ? -dy : dy;

  if (ax - ay > SNAP_EPS) {
    return dx < 0 ? EFConnectableSide.LEFT : EFConnectableSide.RIGHT;
  }
  if (ay - ax > SNAP_EPS) {
    return dy < 0 ? EFConnectableSide.TOP : EFConnectableSide.BOTTOM;
  }

  return dy < 0 ? EFConnectableSide.TOP : EFConnectableSide.BOTTOM;
}

/**
 * Quick membership check via bit mask.
 */
function _isAllowed(side: EFConnectableSide, mask: SideMask): boolean {
  switch (side) {
    case EFConnectableSide.LEFT:
      return (mask & SideMask.LEFT) !== 0;
    case EFConnectableSide.RIGHT:
      return (mask & SideMask.RIGHT) !== 0;
    case EFConnectableSide.TOP:
      return (mask & SideMask.TOP) !== 0;
    case EFConnectableSide.BOTTOM:
      return (mask & SideMask.BOTTOM) !== 0;
    default:
      return true;
  }
}

/**
 * Picks the best available side from allowed mask by maximizing directional score.
 * No intermediate objects, constant-time operations.
 */
function _pickFallbackSide(
  dx: number,
  dy: number,
  allowedMask: SideMask,
  ideal: EFConnectableSide,
): EFConnectableSide {
  let bestSide: EFConnectableSide = ideal;
  let bestScore = -Infinity;

  if (allowedMask & SideMask.RIGHT) {
    const s = dx;
    if (s > bestScore) {
      bestScore = s;
      bestSide = EFConnectableSide.RIGHT;
    }
  }
  if (allowedMask & SideMask.LEFT) {
    const s = -dx;
    if (s > bestScore) {
      bestScore = s;
      bestSide = EFConnectableSide.LEFT;
    }
  }
  if (allowedMask & SideMask.BOTTOM) {
    const s = dy;
    if (s > bestScore) {
      bestScore = s;
      bestSide = EFConnectableSide.BOTTOM;
    }
  }
  if (allowedMask & SideMask.TOP) {
    const s = -dy;
    if (s > bestScore) {
      bestScore = s;
      bestSide = EFConnectableSide.TOP;
    }
  }

  return bestSide;
}
