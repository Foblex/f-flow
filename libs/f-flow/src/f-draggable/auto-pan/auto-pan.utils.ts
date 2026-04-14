import { IPoint, Point, PointExtensions } from '@foblex/2d';

export type TAutoPanMode = 'rebase' | 'direct';

const REBASE_AUTO_PAN_KINDS = new Set(['create-connection', 'reassign-connection', 'drag-node']);
const DIRECT_AUTO_PAN_KINDS = new Set(['selection-area']);
const AUXILIARY_AUTO_PAN_KINDS = new Set(['assign-to-container']);

export function resolveAutoPanMode(kinds: string[]): TAutoPanMode | null {
  let result: TAutoPanMode | null = null;

  for (const kind of kinds) {
    if (AUXILIARY_AUTO_PAN_KINDS.has(kind)) {
      continue;
    }

    const next = REBASE_AUTO_PAN_KINDS.has(kind)
      ? 'rebase'
      : DIRECT_AUTO_PAN_KINDS.has(kind)
        ? 'direct'
        : null;

    if (!next) {
      return null;
    }

    if (!result) {
      result = next;

      continue;
    }

    if (result !== next) {
      return null;
    }
  }

  return result;
}

export function calculateAutoPanDelta(
  pointerPosition: IPoint,
  hostRect: DOMRect,
  threshold: number,
  speed: number,
  acceleration: boolean,
): IPoint {
  return PointExtensions.initialize(
    calculateAutoPanAxisDelta(
      pointerPosition.x,
      hostRect.left,
      hostRect.right,
      threshold,
      speed,
      acceleration,
    ),
    calculateAutoPanAxisDelta(
      pointerPosition.y,
      hostRect.top,
      hostRect.bottom,
      threshold,
      speed,
      acceleration,
    ),
  );
}

export function calculateAutoPanAxisDelta(
  pointerCoordinate: number,
  min: number,
  max: number,
  threshold: number,
  speed: number,
  acceleration: boolean,
): number {
  const normalizedThreshold = Math.max(0, threshold);
  const normalizedSpeed = Math.max(0, speed);

  if (!normalizedThreshold || !normalizedSpeed) {
    return 0;
  }

  if (pointerCoordinate <= min + normalizedThreshold) {
    const ratio = clamp(
      (min + normalizedThreshold - pointerCoordinate) / normalizedThreshold,
      0,
      1,
    );

    return resolveAxisSpeed(ratio, normalizedSpeed, acceleration);
  }

  if (pointerCoordinate >= max - normalizedThreshold) {
    const ratio = clamp(
      (pointerCoordinate - (max - normalizedThreshold)) / normalizedThreshold,
      0,
      1,
    );

    return -resolveAxisSpeed(ratio, normalizedSpeed, acceleration);
  }

  return 0;
}

export function rebaseAutoPanPointerDownPosition(
  position: IPoint,
  canvasDelta: IPoint,
  scale: number,
): Point {
  const normalizedScale = scale || 1;

  return Point.fromPoint(position).add(Point.fromPoint(canvasDelta).div(normalizedScale));
}

function resolveAxisSpeed(ratio: number, speed: number, acceleration: boolean): number {
  return acceleration ? speed * ratio : speed;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
