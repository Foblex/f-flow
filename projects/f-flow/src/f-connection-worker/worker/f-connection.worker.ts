type TFConnectionWorkerSide = 'top' | 'right' | 'bottom' | 'left' | 'auto' | 'default';

interface IFConnectionWorkerRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IFConnectionWorkerRequestItem {
  originalIndex: number;
  behavior: string;
  outputSide: string;
  inputSide: string;
  sourceConnectableSide: string;
  targetConnectableSide: string;
  sourceRect: IFConnectionWorkerRect;
  targetRect: IFConnectionWorkerRect;
}

interface IFConnectionWorkerRequestMessage {
  requestId: number;
  items: IFConnectionWorkerRequestItem[];
}

interface IFConnectionWorkerLine {
  point1: { x: number; y: number };
  point2: { x: number; y: number };
}

interface IFConnectionWorkerResultItem {
  originalIndex?: number;
  supported: boolean;
  sourceSide?: string;
  targetSide?: string;
  line?: IFConnectionWorkerLine;
}

interface IFConnectionWorkerResponseMessage {
  requestId: number;
  results?: IFConnectionWorkerResultItem[];
  error?: string;
}

const EPSILON = 0.5;

addEventListener('message', (event: MessageEvent<IFConnectionWorkerRequestMessage>) => {
  const data = event?.data;
  const requestId = data?.requestId;
  const items = Array.isArray(data?.items) ? data.items : [];

  try {
    const results = items.map((item) => _calculateItem(item));
    const response: IFConnectionWorkerResponseMessage = { requestId, results };
    postMessage(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connection worker failed.';
    const response: IFConnectionWorkerResponseMessage = { requestId, error: message };
    postMessage(response);
  }
});

function _calculateItem(item: IFConnectionWorkerRequestItem): IFConnectionWorkerResultItem {
  const sourceCenterX = item.sourceRect.x + item.sourceRect.width / 2;
  const sourceCenterY = item.sourceRect.y + item.sourceRect.height / 2;
  const targetCenterX = item.targetRect.x + item.targetRect.width / 2;
  const targetCenterY = item.targetRect.y + item.targetRect.height / 2;

  const sourceSide = _resolveConnectableSide(
    item.outputSide,
    targetCenterX - sourceCenterX,
    targetCenterY - sourceCenterY,
    item.sourceConnectableSide,
  );

  const targetSide = _resolveConnectableSide(
    item.inputSide,
    sourceCenterX - targetCenterX,
    sourceCenterY - targetCenterY,
    item.targetConnectableSide,
  );

  if (item.behavior === 'fixed_center') {
    return {
      originalIndex: item.originalIndex,
      supported: true,
      sourceSide,
      targetSide,
      line: {
        point1: { x: sourceCenterX, y: sourceCenterY },
        point2: { x: targetCenterX, y: targetCenterY },
      },
    };
  }

  if (item.behavior !== 'fixed') {
    if (item.behavior !== 'floating') {
      return { originalIndex: item.originalIndex, supported: false };
    }

    return {
      originalIndex: item.originalIndex,
      supported: true,
      sourceSide,
      targetSide,
      line: _buildFloatingLine(item.sourceRect, item.targetRect),
    };
  }

  const line = _buildFixedLine(item.sourceRect, item.targetRect, sourceSide, targetSide);
  if (!line) {
    return { originalIndex: item.originalIndex, supported: false };
  }

  return {
    originalIndex: item.originalIndex,
    supported: true,
    sourceSide,
    targetSide,
    line,
  };
}

function _resolveConnectableSide(
  requestedSide: string,
  deltaX: number,
  deltaY: number,
  fallbackSide: string,
): string {
  if (requestedSide === 'default') {
    return fallbackSide;
  }

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  const nearZero = absX < EPSILON && absY < EPSILON;

  if (nearZero) {
    return fallbackSide;
  }

  const horizontalDominant = absX >= absY;

  switch (requestedSide) {
    case 'calculate':
      return horizontalDominant ? (deltaX >= 0 ? 'right' : 'left') : deltaY >= 0 ? 'bottom' : 'top';

    case 'calculate_horizontal':
      if (absX < EPSILON) {
        return fallbackSide;
      }

      return deltaX >= 0 ? 'right' : 'left';

    case 'calculate_vertical':
      if (absY < EPSILON) {
        return fallbackSide;
      }

      return deltaY >= 0 ? 'bottom' : 'top';

    case 'top':
    case 'bottom':
    case 'left':
    case 'right':
      return requestedSide;

    default:
      return fallbackSide;
  }
}

function _buildFixedLine(
  sourceRect: IFConnectionWorkerRect,
  targetRect: IFConnectionWorkerRect,
  sourceSide: string,
  targetSide: string,
): IFConnectionWorkerLine | null {
  const sourceAnchor = (sourceSide === 'auto' ? 'bottom' : sourceSide) as TFConnectionWorkerSide;
  const targetAnchor = (targetSide === 'auto' ? 'top' : targetSide) as TFConnectionWorkerSide;

  const point1 = _getSidePoint(sourceRect, sourceAnchor);
  const point2 = _getSidePoint(targetRect, targetAnchor);

  if (!point1 || !point2) {
    return null;
  }

  return { point1, point2 };
}

function _buildFloatingLine(
  sourceRect: IFConnectionWorkerRect,
  targetRect: IFConnectionWorkerRect,
): IFConnectionWorkerLine {
  const sourceCenter = _getRectCenter(sourceRect);
  const targetCenter = _getRectCenter(targetRect);

  return {
    point1: _getRectBorderIntersection(sourceRect, sourceCenter, targetCenter),
    point2: _getRectBorderIntersection(targetRect, targetCenter, sourceCenter),
  };
}

function _getRectCenter(rect: IFConnectionWorkerRect): { x: number; y: number } {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function _getRectBorderIntersection(
  rect: IFConnectionWorkerRect,
  from: { x: number; y: number },
  to: { x: number; y: number },
): { x: number; y: number } {
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;
  const center = _getRectCenter(rect);

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) {
    return center;
  }

  const tx = Math.abs(dx) > EPSILON ? halfWidth / Math.abs(dx) : Number.POSITIVE_INFINITY;
  const ty = Math.abs(dy) > EPSILON ? halfHeight / Math.abs(dy) : Number.POSITIVE_INFINITY;
  const t = Math.min(tx, ty);

  return {
    x: center.x + dx * t,
    y: center.y + dy * t,
  };
}

function _getSidePoint(
  rect: IFConnectionWorkerRect,
  side: TFConnectionWorkerSide,
): { x: number; y: number } | null {
  switch (side) {
    case 'top':
      return { x: rect.x + rect.width / 2, y: rect.y };
    case 'bottom':
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height };
    case 'left':
      return { x: rect.x, y: rect.y + rect.height / 2 };
    case 'right':
      return { x: rect.x + rect.width, y: rect.y + rect.height / 2 };
    default:
      return null;
  }
}
