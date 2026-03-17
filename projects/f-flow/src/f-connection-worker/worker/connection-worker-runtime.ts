type TConnectionWorkerUrlApi = Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'>;

type TConnectionWorkerRuntime = {
  blobCtor: typeof Blob;
  workerCtor: typeof Worker;
  urlApi: TConnectionWorkerUrlApi;
};

const F_CONNECTION_WORKER_SOURCE = String.raw`
const EPSILON = 0.5;

addEventListener('message', (event) => {
  const data = event?.data;
  const requestId = data?.requestId;
  const items = Array.isArray(data?.items) ? data.items : [];

  try {
    const results = items.map((item) => calculateItem(item));
    postMessage({ requestId, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connection worker failed.';
    postMessage({ requestId, error: message });
  }
});

function calculateItem(item) {
  const sourceCenterX = item.sourceRect.x + item.sourceRect.width / 2;
  const sourceCenterY = item.sourceRect.y + item.sourceRect.height / 2;
  const targetCenterX = item.targetRect.x + item.targetRect.width / 2;
  const targetCenterY = item.targetRect.y + item.targetRect.height / 2;

  const sourceSide = resolveConnectableSide(
    item.outputSide,
    targetCenterX - sourceCenterX,
    targetCenterY - sourceCenterY,
    item.sourceConnectableSide,
  );

  const targetSide = resolveConnectableSide(
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
      line: buildFloatingLine(item.sourceRect, item.targetRect),
    };
  }

  const line = buildFixedLine(item.sourceRect, item.targetRect, sourceSide, targetSide);
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

function resolveConnectableSide(requestedSide, deltaX, deltaY, fallbackSide) {
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

function buildFixedLine(sourceRect, targetRect, sourceSide, targetSide) {
  const sourceAnchor = sourceSide === 'auto' ? 'bottom' : sourceSide;
  const targetAnchor = targetSide === 'auto' ? 'top' : targetSide;

  const point1 = getSidePoint(sourceRect, sourceAnchor);
  const point2 = getSidePoint(targetRect, targetAnchor);

  if (!point1 || !point2) {
    return null;
  }

  return { point1, point2 };
}

function buildFloatingLine(sourceRect, targetRect) {
  const sourceCenter = getRectCenter(sourceRect);
  const targetCenter = getRectCenter(targetRect);

  return {
    point1: getRectBorderIntersection(sourceRect, sourceCenter, targetCenter),
    point2: getRectBorderIntersection(targetRect, targetCenter, sourceCenter),
  };
}

function getRectCenter(rect) {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function getRectBorderIntersection(rect, from, to) {
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;
  const center = getRectCenter(rect);

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) {
    return center;
  }

  const scaleX = Math.abs(dx) < EPSILON ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(dx);
  const scaleY = Math.abs(dy) < EPSILON ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);

  return {
    x: center.x + dx * scale,
    y: center.y + dy * scale,
  };
}

function getSidePoint(rect, side) {
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;

  switch (side) {
    case 'top':
      return { x: centerX, y: rect.y };

    case 'right':
      return { x: rect.x + rect.width, y: centerY };

    case 'bottom':
      return { x: centerX, y: rect.y + rect.height };

    case 'left':
      return { x: rect.x, y: centerY };

    default:
      return null;
  }
}
`.trim();

export function isConnectionWorkerRuntimeSupported(windowRef: Window | null | undefined): boolean {
  return !!resolveConnectionWorkerRuntime(windowRef);
}

export function resolveConnectionWorkerRuntime(
  windowRef: Window | null | undefined,
): TConnectionWorkerRuntime | null {
  const runtimeWindow = windowRef as Partial<Window & typeof globalThis> | null | undefined;
  const blobCtor = runtimeWindow?.Blob;
  const workerCtor = runtimeWindow?.Worker;
  const urlApi = runtimeWindow?.URL;
  if (!blobCtor || !workerCtor) {
    return null;
  }

  if (
    typeof urlApi?.createObjectURL !== 'function' ||
    typeof urlApi.revokeObjectURL !== 'function'
  ) {
    return null;
  }

  return {
    blobCtor,
    workerCtor,
    urlApi,
  };
}

export function createConnectionWorkerUrl(runtime: TConnectionWorkerRuntime): string {
  const blob = new runtime.blobCtor([F_CONNECTION_WORKER_SOURCE], {
    type: 'text/javascript',
  });

  return runtime.urlApi.createObjectURL(blob);
}

export function revokeConnectionWorkerUrl(
  workerUrl: string | null | undefined,
  urlApi?: Pick<typeof URL, 'revokeObjectURL'> | null,
): void {
  if (!workerUrl) {
    return;
  }

  const resolvedUrlApi = urlApi ?? (typeof URL === 'undefined' ? null : URL);
  if (typeof resolvedUrlApi?.revokeObjectURL !== 'function') {
    return;
  }

  resolvedUrlApi.revokeObjectURL(workerUrl);
}
