import { inject, Injectable, OnDestroy } from '@angular/core';
import { ILine } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import { FComponentsStore } from '../../../f-storage';

export interface IConnectionWorkerRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IConnectionWorkerRequestItem {
  index: number;
  behavior: string;
  outputSide: string;
  inputSide: string;
  sourceConnectableSide: string;
  targetConnectableSide: string;
  sourceRect: IConnectionWorkerRect;
  targetRect: IConnectionWorkerRect;
}

export interface IConnectionWorkerResultItem {
  index: number;
  supported: boolean;
  sourceSide?: string;
  targetSide?: string;
  line?: ILine;
}

interface IConnectionWorkerResponse {
  requestId: number;
  results?: IConnectionWorkerResultItem[];
  error?: string;
}

type TPendingRequest = {
  resolve: (value: readonly IConnectionWorkerResultItem[]) => void;
  reject: (error: Error) => void;
};

/**
 * Optional async worker used to offload connection endpoint calculations
 * (`fixed` / `fixed_center`) from the main thread.
 */
@Injectable()
export class FConnectionCalculationWorker implements OnDestroy {
  private readonly _browser = inject(BrowserService);
  private readonly _store = inject(FComponentsStore);

  private _worker: Worker | null = null;
  private _workerUrl: string | null = null;
  private _nextRequestId = 0;
  private _isDisabled = false;

  private readonly _pending = new Map<number, TPendingRequest>();

  public isEnabled(): boolean {
    if (this._isDisabled || !this._store.useConnectionWorker || !this._browser.isBrowser()) {
      return false;
    }

    const windowRef = this._browser.document.defaultView;

    return !!windowRef?.Worker && !!windowRef?.Blob && !!windowRef?.URL;
  }

  public calculate(
    payload: readonly IConnectionWorkerRequestItem[],
  ): Promise<readonly IConnectionWorkerResultItem[]> {
    if (!payload.length) {
      return Promise.resolve([]);
    }

    if (!this.isEnabled()) {
      return Promise.reject(new Error('Connection worker is disabled.'));
    }

    const worker = this._ensureWorker();
    if (!worker) {
      return Promise.reject(new Error('Unable to initialize connection worker.'));
    }

    const requestId = ++this._nextRequestId;

    return new Promise((resolve, reject) => {
      this._pending.set(requestId, { resolve, reject });

      try {
        worker.postMessage({
          requestId,
          items: payload,
        });
      } catch (error) {
        this._pending.delete(requestId);
        reject(
          error instanceof Error
            ? error
            : new Error('Unknown error while posting message to connection worker.'),
        );
      }
    });
  }

  public ngOnDestroy(): void {
    this._rejectAllPending(new Error('Connection worker was destroyed.'));
    this._destroyWorker();
  }

  private _ensureWorker(): Worker | null {
    if (this._worker) {
      return this._worker;
    }

    const windowRef = this._browser.document.defaultView;
    if (!windowRef?.Worker || !windowRef.Blob || !windowRef.URL) {
      return null;
    }

    try {
      const blob = new windowRef.Blob([CONNECTION_WORKER_SOURCE], {
        type: 'application/javascript',
      });
      const url = windowRef.URL.createObjectURL(blob);
      const worker = new windowRef.Worker(url, {
        name: 'f-flow-connection-worker',
      });

      worker.onmessage = (event: MessageEvent<IConnectionWorkerResponse>) => {
        this._handleWorkerMessage(event.data);
      };
      worker.onerror = () => {
        this._disableWorker(new Error('Connection worker runtime error.'));
      };

      this._worker = worker;
      this._workerUrl = url;

      return worker;
    } catch (error) {
      this._disableWorker(
        error instanceof Error ? error : new Error('Connection worker initialization failed.'),
      );

      return null;
    }
  }

  private _handleWorkerMessage(message: IConnectionWorkerResponse | undefined): void {
    if (!message || typeof message.requestId !== 'number') {
      return;
    }

    const request = this._pending.get(message.requestId);
    if (!request) {
      return;
    }

    this._pending.delete(message.requestId);

    if (message.error) {
      request.reject(new Error(message.error));

      return;
    }

    request.resolve(message.results ?? []);
  }

  private _disableWorker(error: Error): void {
    this._isDisabled = true;
    this._rejectAllPending(error);
    this._destroyWorker();
  }

  private _rejectAllPending(error: Error): void {
    this._pending.forEach((request) => request.reject(error));
    this._pending.clear();
  }

  private _destroyWorker(): void {
    this._worker?.terminate();
    this._worker = null;

    if (this._workerUrl) {
      this._browser.document.defaultView?.URL?.revokeObjectURL(this._workerUrl);
      this._workerUrl = null;
    }
  }
}

const CONNECTION_WORKER_SOURCE = `
  const EPSILON = 0.5;

  self.onmessage = function(event) {
    const data = event && event.data ? event.data : {};
    const requestId = data.requestId;
    const items = Array.isArray(data.items) ? data.items : [];

    try {
      const results = items.map(calculateItem);
      self.postMessage({ requestId, results });
    } catch (error) {
      const message = error && error.message ? error.message : 'Connection worker failed.';
      self.postMessage({ requestId, error: message });
    }
  };

  function calculateItem(item) {
    const sourceCenterX = item.sourceRect.x + item.sourceRect.width / 2;
    const sourceCenterY = item.sourceRect.y + item.sourceRect.height / 2;
    const targetCenterX = item.targetRect.x + item.targetRect.width / 2;
    const targetCenterY = item.targetRect.y + item.targetRect.height / 2;

    const sourceSide = resolveConnectableSide(
      item.outputSide,
      targetCenterX - sourceCenterX,
      targetCenterY - sourceCenterY,
      item.sourceConnectableSide
    );

    const targetSide = resolveConnectableSide(
      item.inputSide,
      sourceCenterX - targetCenterX,
      sourceCenterY - targetCenterY,
      item.targetConnectableSide
    );

    if (item.behavior === 'fixed_center') {
      return {
        index: item.index,
        supported: true,
        sourceSide: sourceSide,
        targetSide: targetSide,
        line: {
          point1: { x: sourceCenterX, y: sourceCenterY },
          point2: { x: targetCenterX, y: targetCenterY }
        }
      };
    }

    if (item.behavior !== 'fixed') {
      return { index: item.index, supported: false };
    }

    const line = buildFixedLine(item.sourceRect, item.targetRect, sourceSide, targetSide);
    if (!line) {
      return { index: item.index, supported: false };
    }

    return {
      index: item.index,
      supported: true,
      sourceSide: sourceSide,
      targetSide: targetSide,
      line: line
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
        return horizontalDominant
          ? (deltaX >= 0 ? 'right' : 'left')
          : (deltaY >= 0 ? 'bottom' : 'top');

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

    return { point1: point1, point2: point2 };
  }

  function getSidePoint(rect, side) {
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
`;
