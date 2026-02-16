import { IRect } from '@foblex/2d';
import { IMagneticGapRect } from './i-magnetic-gap-rect';
import { IMagneticRectsResult, MagneticRectsAlignMode } from './i-magnetic-rects-result';

type IAxisCandidate = {
  delta: number;
  absDelta: number;
  gap: number;
  rects: IMagneticGapRect[];
  alignMode: MagneticRectsAlignMode;

  crossDelta: number;
};

const AXIS_X_ALIGN_MODES: MagneticRectsAlignMode[] = ['top', 'center', 'bottom'];
const AXIS_Y_ALIGN_MODES: MagneticRectsAlignMode[] = ['left', 'center', 'right'];

export function calculateMagneticRects(
  elements: IRect[],
  target: IRect,
  alignThreshold: number = 10,
  spacingThreshold: number = 10,
): IMagneticRectsResult {
  const tx = target.x;
  const ty = target.y;

  const tr = tx + target.width;
  const tb = ty + target.height;

  const tcx = target.gravityCenter.x;
  const tcy = target.gravityCenter.y;

  const xCandidate = _calculateAxisX_FigmaLike(
    elements,
    target,
    tx,
    ty,
    tr,
    tb,
    tcx,
    tcy,
    alignThreshold,
    spacingThreshold,
  );

  const yCandidate = _calculateAxisY_FigmaLike(
    elements,
    target,
    tx,
    ty,
    tr,
    tb,
    tcx,
    tcy,
    alignThreshold,
    spacingThreshold,
  );

  if (xCandidate && (!yCandidate || xCandidate.absDelta <= yCandidate.absDelta)) {
    return {
      axis: 'x',
      delta: xCandidate.delta,
      gap: xCandidate.gap,
      rects: xCandidate.rects,
      alignMode: xCandidate.alignMode,

      crossDelta: xCandidate.crossDelta,
    };
  }

  if (yCandidate) {
    return {
      axis: 'y',
      delta: yCandidate.delta,
      gap: yCandidate.gap,
      rects: yCandidate.rects,
      alignMode: yCandidate.alignMode,

      crossDelta: yCandidate.crossDelta,
    };
  }

  return { rects: [] };
}

function _calculateAxisX_FigmaLike(
  elements: IRect[],
  target: IRect,
  tx: number,
  ty: number,
  _tr: number,
  tb: number,
  tcx: number,
  tcy: number,
  alignThreshold: number,
  spacingThreshold: number,
): IAxisCandidate | undefined {
  let bestAbs = Infinity;
  let bestDelta: number | undefined;
  let bestGap = 0;
  let bestAlignMode: MagneticRectsAlignMode | undefined;
  let bestRects: IMagneticGapRect[] = [];

  let bestCrossDelta = 0;

  const indices: number[] = [];
  const starts: number[] = [];
  const ends: number[] = [];

  for (let modeIndex = 0; modeIndex < AXIS_X_ALIGN_MODES.length; modeIndex++) {
    const targetAnchor = modeIndex === 0 ? ty : modeIndex === 1 ? tcy : tb;

    indices.length = 0;
    starts.length = 0;
    ends.length = 0;

    let bandTop = Infinity;
    let bandBottom = -Infinity;

    // pick guide anchor deterministically: min abs to targetAnchor, tie - smaller element index
    let guideAnchor = 0;
    let guideAbs = Infinity;
    let guideElementIndex = Infinity;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      const elAnchor =
        modeIndex === 0 ? el.y : modeIndex === 1 ? el.gravityCenter.y : el.y + el.height;

      const alignDelta = targetAnchor - elAnchor;
      const alignAbs = _abs(alignDelta);
      if (alignAbs > alignThreshold) continue;

      indices.push(i);
      starts.push(el.x);
      ends.push(el.x + el.width);

      const top = el.y;
      const bottom = el.y + el.height;
      if (top < bandTop) bandTop = top;
      if (bottom > bandBottom) bandBottom = bottom;

      // guide selection
      if (alignAbs < guideAbs || (alignAbs === guideAbs && i < guideElementIndex)) {
        guideAbs = alignAbs;
        guideAnchor = elAnchor;
        guideElementIndex = i;
      }
    }

    const count = indices.length;
    if (count < 2) continue;

    _stableSortByStart(indices, starts, ends);

    let insertion = 0;
    while (insertion < count && starts[insertion] <= tcx) insertion++;

    const between = insertion > 0 && insertion < count;

    let leftIndex: number;
    let rightIndex: number;

    if (between) {
      leftIndex = insertion - 1;
      rightIndex = insertion;
    } else if (insertion <= 0) {
      leftIndex = 0;
      rightIndex = 1;
    } else {
      leftIndex = count - 2;
      rightIndex = count - 1;
    }

    const g = starts[rightIndex] - ends[leftIndex];
    if (g < 0) continue;

    let desiredLeft: number;

    if (between) {
      desiredLeft = ends[leftIndex] + g;

      const desiredRight = desiredLeft + target.width;
      const rightGap = starts[rightIndex] - desiredRight;
      if (_abs(rightGap - g) > spacingThreshold) continue;
    } else if (insertion <= 0) {
      desiredLeft = starts[0] - g - target.width;
    } else {
      desiredLeft = ends[count - 1] + g;
    }

    const delta = tx - desiredLeft;
    const absDelta = _abs(delta);

    if (absDelta > spacingThreshold) continue;
    if (absDelta >= bestAbs) continue;

    const rects = _buildGapRectsXWithBand(indices, starts, ends, bandTop, bandBottom);

    // extra rects around snapped target, same band
    if (between) {
      const snappedLeft = desiredLeft;
      const snappedRight = desiredLeft + target.width;

      rects.push({
        left: ends[leftIndex],
        top: bandTop,
        width: snappedLeft - ends[leftIndex],
        height: bandBottom - bandTop,
      });

      rects.push({
        left: snappedRight,
        top: bandTop,
        width: starts[rightIndex] - snappedRight,
        height: bandBottom - bandTop,
      });
    } else if (insertion <= 0) {
      const snappedRight = desiredLeft + target.width;

      rects.push({
        left: snappedRight,
        top: bandTop,
        width: starts[0] - snappedRight,
        height: bandBottom - bandTop,
      });
    } else {
      rects.push({
        left: ends[count - 1],
        top: bandTop,
        width: desiredLeft - ends[count - 1],
        height: bandBottom - bandTop,
      });
    }

    const crossDelta = targetAnchor - guideAnchor;

    bestAbs = absDelta;
    bestDelta = delta;
    bestGap = g;
    bestAlignMode = AXIS_X_ALIGN_MODES[modeIndex];
    bestRects = rects;

    bestCrossDelta = crossDelta;
  }

  if (bestDelta === undefined || bestAlignMode === undefined) return undefined;

  return {
    delta: bestDelta,
    absDelta: bestAbs,
    gap: bestGap,
    rects: bestRects,
    alignMode: bestAlignMode,

    crossDelta: bestCrossDelta,
  };
}

function _calculateAxisY_FigmaLike(
  elements: IRect[],
  target: IRect,
  tx: number,
  ty: number,
  tr: number,
  _tb: number,
  tcx: number,
  tcy: number,
  alignThreshold: number,
  spacingThreshold: number,
): IAxisCandidate | undefined {
  let bestAbs = Infinity;
  let bestDelta: number | undefined;
  let bestGap = 0;
  let bestAlignMode: MagneticRectsAlignMode | undefined;
  let bestRects: IMagneticGapRect[] = [];

  let bestCrossDelta = 0;

  const indices: number[] = [];
  const starts: number[] = [];
  const ends: number[] = [];

  for (let modeIndex = 0; modeIndex < AXIS_Y_ALIGN_MODES.length; modeIndex++) {
    const targetAnchor = modeIndex === 0 ? tx : modeIndex === 1 ? tcx : tr;

    indices.length = 0;
    starts.length = 0;
    ends.length = 0;

    let bandLeft = Infinity;
    let bandRight = -Infinity;

    let guideAnchor = 0;
    let guideAbs = Infinity;
    let guideElementIndex = Infinity;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      const elAnchor =
        modeIndex === 0 ? el.x : modeIndex === 1 ? el.gravityCenter.x : el.x + el.width;

      const alignDelta = targetAnchor - elAnchor;
      const alignAbs = _abs(alignDelta);
      if (alignAbs > alignThreshold) continue;

      indices.push(i);
      starts.push(el.y);
      ends.push(el.y + el.height);

      const left = el.x;
      const right = el.x + el.width;
      if (left < bandLeft) bandLeft = left;
      if (right > bandRight) bandRight = right;

      if (alignAbs < guideAbs || (alignAbs === guideAbs && i < guideElementIndex)) {
        guideAbs = alignAbs;
        guideAnchor = elAnchor;
        guideElementIndex = i;
      }
    }

    const count = indices.length;
    if (count < 2) continue;

    _stableSortByStart(indices, starts, ends);

    let insertion = 0;
    while (insertion < count && starts[insertion] <= tcy) insertion++;

    const between = insertion > 0 && insertion < count;

    let topIndex: number;
    let bottomIndex: number;

    if (between) {
      topIndex = insertion - 1;
      bottomIndex = insertion;
    } else if (insertion <= 0) {
      topIndex = 0;
      bottomIndex = 1;
    } else {
      topIndex = count - 2;
      bottomIndex = count - 1;
    }

    const g = starts[bottomIndex] - ends[topIndex];
    if (g < 0) continue;

    let desiredTop: number;

    if (between) {
      desiredTop = ends[topIndex] + g;

      const desiredBottom = desiredTop + target.height;
      const bottomGap = starts[bottomIndex] - desiredBottom;
      if (_abs(bottomGap - g) > spacingThreshold) continue;
    } else if (insertion <= 0) {
      desiredTop = starts[0] - g - target.height;
    } else {
      desiredTop = ends[count - 1] + g;
    }

    const delta = ty - desiredTop;
    const absDelta = _abs(delta);

    if (absDelta > spacingThreshold) continue;
    if (absDelta >= bestAbs) continue;

    const rects = _buildGapRectsYWithBand(indices, starts, ends, bandLeft, bandRight);

    if (between) {
      const snappedTop = desiredTop;
      const snappedBottom = desiredTop + target.height;

      rects.push({
        left: bandLeft,
        top: ends[topIndex],
        width: bandRight - bandLeft,
        height: snappedTop - ends[topIndex],
      });

      rects.push({
        left: bandLeft,
        top: snappedBottom,
        width: bandRight - bandLeft,
        height: starts[bottomIndex] - snappedBottom,
      });
    } else if (insertion <= 0) {
      const snappedBottom = desiredTop + target.height;

      rects.push({
        left: bandLeft,
        top: snappedBottom,
        width: bandRight - bandLeft,
        height: starts[0] - snappedBottom,
      });
    } else {
      rects.push({
        left: bandLeft,
        top: ends[count - 1],
        width: bandRight - bandLeft,
        height: desiredTop - ends[count - 1],
      });
    }

    const crossDelta = targetAnchor - guideAnchor;

    bestAbs = absDelta;
    bestDelta = delta;
    bestGap = g;
    bestAlignMode = AXIS_Y_ALIGN_MODES[modeIndex];
    bestRects = rects;

    bestCrossDelta = crossDelta;
  }

  if (bestDelta === undefined || bestAlignMode === undefined) return undefined;

  return {
    delta: bestDelta,
    absDelta: bestAbs,
    gap: bestGap,
    rects: bestRects,
    alignMode: bestAlignMode,

    crossDelta: bestCrossDelta,
  };
}

function _buildGapRectsXWithBand(
  indices: number[],
  starts: number[],
  ends: number[],
  bandTop: number,
  bandBottom: number,
): IMagneticGapRect[] {
  const rects: IMagneticGapRect[] = [];
  const height = bandBottom - bandTop;

  for (let i = 0; i < indices.length - 1; i++) {
    const gap = starts[i + 1] - ends[i];
    if (gap < 0) continue;

    rects.push({
      left: ends[i],
      top: bandTop,
      width: gap,
      height,
    });
  }

  return rects;
}

function _buildGapRectsYWithBand(
  indices: number[],
  starts: number[],
  ends: number[],
  bandLeft: number,
  bandRight: number,
): IMagneticGapRect[] {
  const rects: IMagneticGapRect[] = [];
  const width = bandRight - bandLeft;

  for (let i = 0; i < indices.length - 1; i++) {
    const gap = starts[i + 1] - ends[i];
    if (gap < 0) continue;

    rects.push({
      left: bandLeft,
      top: ends[i],
      width,
      height: gap,
    });
  }

  return rects;
}

function _stableSortByStart(indices: number[], starts: number[], ends: number[]): void {
  for (let i = 1; i < starts.length; i++) {
    const start = starts[i];
    const end = ends[i];
    const index = indices[i];

    let j = i - 1;

    while (j >= 0) {
      const prevStart = starts[j];
      const prevIndex = indices[j];

      const shouldStop = prevStart < start || (prevStart === start && prevIndex < index);
      if (shouldStop) break;

      starts[j + 1] = prevStart;
      ends[j + 1] = ends[j];
      indices[j + 1] = prevIndex;
      j--;
    }

    starts[j + 1] = start;
    ends[j + 1] = end;
    indices[j + 1] = index;
  }
}

function _abs(v: number): number {
  return v < 0 ? -v : v;
}
