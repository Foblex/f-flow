import { IPoint } from '@foblex/2d';
import { EFConnectableSide } from '../../../../enums';

export function buildCornerMidPointsAndApplyOffsets(params: {
  axis: 'x' | 'y';
  source: IPoint;
  target: IPoint;

  sourceSide: EFConnectableSide;
  targetSide: EFConnectableSide;

  sourceGap: IPoint;
  targetGap: IPoint;

  sourceDir: IPoint;
  targetDir: IPoint;

  currentDir: number;
  offset: number;

  sourceGapOffset: IPoint;
  targetGapOffset: IPoint;
}): IPoint[] {
  const {
    axis,
    source,
    target,
    sourceSide,
    targetSide,
    sourceGap,
    targetGap,
    sourceDir,
    targetDir,
    currentDir,
    offset,
    sourceGapOffset,
    targetGapOffset,
  } = params;

  const corners = buildCornerPoints(sourceGap, targetGap);

  let midPoints = pickCornerByDirection(axis, sourceDir, currentDir, corners);

  if (sourceSide === targetSide) {
    applySameSideGapOffsetFix(
      axis,
      source,
      target,
      offset,
      sourceDir,
      currentDir,
      sourceGap,
      targetGap,
      sourceGapOffset,
      targetGapOffset,
    );
  } else {
    midPoints = maybeFlipCornerForDifferentSides(
      axis,
      sourceDir,
      targetDir,
      sourceGap,
      targetGap,
      corners,
      midPoints,
    );
  }

  return midPoints;
}

function buildCornerPoints(
  sourceGap: IPoint,
  targetGap: IPoint,
): { sourceTarget: IPoint[]; targetSource: IPoint[] } {
  return {
    sourceTarget: [{ x: sourceGap.x, y: targetGap.y }],
    targetSource: [{ x: targetGap.x, y: sourceGap.y }],
  };
}

function pickCornerByDirection(
  axis: 'x' | 'y',
  sourceDir: IPoint,
  currentDir: number,
  corners: { sourceTarget: IPoint[]; targetSource: IPoint[] },
): IPoint[] {
  if (axis === 'x') {
    return sourceDir.x === currentDir ? corners.targetSource : corners.sourceTarget;
  }

  return sourceDir.y === currentDir ? corners.sourceTarget : corners.targetSource;
}

function applySameSideGapOffsetFix(
  axis: 'x' | 'y',
  source: IPoint,
  target: IPoint,
  offset: number,
  sourceDir: IPoint,
  currentDir: number,
  sourceGap: IPoint,
  targetGap: IPoint,
  sourceGapOffset: IPoint,
  targetGapOffset: IPoint,
): void {
  const diff = Math.abs(source[axis] - target[axis]);
  if (diff > offset) return;

  const gapOffset = Math.min(offset - 1, offset - diff);
  if (gapOffset <= 0) return;

  if (sourceDir[axis] === currentDir) {
    sourceGapOffset[axis] = (sourceGap[axis] > source[axis] ? -1 : 1) * gapOffset;
  } else {
    targetGapOffset[axis] = (targetGap[axis] > target[axis] ? -1 : 1) * gapOffset;
  }
}

function maybeFlipCornerForDifferentSides(
  axis: 'x' | 'y',
  sourceDir: IPoint,
  targetDir: IPoint,
  sourceGap: IPoint,
  targetGap: IPoint,
  corners: { sourceTarget: IPoint[]; targetSource: IPoint[] },
  currentPicked: IPoint[],
): IPoint[] {
  const opp = axis === 'x' ? 'y' : 'x';

  const isSameDir = sourceDir[axis] === targetDir[opp];
  const sourceGt = sourceGap[opp] > targetGap[opp];
  const sourceLt = sourceGap[opp] < targetGap[opp];

  const flip =
    (sourceDir[axis] === 1 && ((!isSameDir && sourceGt) || (isSameDir && sourceLt))) ||
    (sourceDir[axis] !== 1 && ((!isSameDir && sourceLt) || (isSameDir && sourceGt)));

  if (!flip) return currentPicked;

  return axis === 'x' ? corners.sourceTarget : corners.targetSource;
}
