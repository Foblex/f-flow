import { inject, Injectable, NgZone } from '@angular/core';
import { FNodeSizeRegistry } from './f-node-size-registry';

interface IMeasurementEntry {
  nodeId: string;
  element: HTMLElement;
}

@Injectable()
export class FMeasurementPipeline {
  private readonly _queue = new Map<string, HTMLElement>();
  private _rafId: number | null = null;
  private _batchSize = 50;
  private _scale = 1;

  private readonly _resizeObserver: ResizeObserver | null = null;
  private readonly _observedElements = new Map<string, HTMLElement>();
  private _onSizeChanged: ((nodeId: string) => void) | null = null;

  private readonly _sizeRegistry = inject(FNodeSizeRegistry);
  private readonly _ngZone = inject(NgZone);

  constructor() {
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          const nodeId =
            element.getAttribute('data-f-node-id') ?? element.getAttribute('data-f-group-id');
          if (nodeId) {
            this.enqueue(nodeId, element);
          }
        }
      });
    }
  }

  public setBatchSize(value: number): void {
    this._batchSize = value;
  }

  public setScale(scale: number): void {
    this._scale = scale;
  }

  public setOnSizeChanged(callback: ((nodeId: string) => void) | null): void {
    this._onSizeChanged = callback;
  }

  public enqueue(nodeId: string, element: HTMLElement): void {
    this._queue.set(nodeId, element);
    this._scheduleProcessing();
  }

  public observeElement(nodeId: string, element: HTMLElement): void {
    if (!this._resizeObserver) {
      return;
    }
    this._observedElements.set(nodeId, element);
    this._resizeObserver.observe(element);
  }

  public unobserveElement(nodeId: string): void {
    if (!this._resizeObserver) {
      return;
    }
    const element = this._observedElements.get(nodeId);
    if (element) {
      this._resizeObserver.unobserve(element);
      this._observedElements.delete(nodeId);
    }
  }

  private _scheduleProcessing(): void {
    if (this._rafId !== null) {
      return;
    }
    this._ngZone.runOutsideAngular(() => {
      this._rafId = requestAnimationFrame(() => {
        this._rafId = null;
        this._processBatch();
      });
    });
  }

  private _processBatch(): void {
    const entries: IMeasurementEntry[] = [];
    const iterator = this._queue.entries();
    let count = 0;

    for (const [nodeId, element] of iterator) {
      if (count >= this._batchSize) {
        break;
      }
      entries.push({ nodeId, element });
      count++;
    }

    // Read phase: collect all rects
    const measurements: { nodeId: string; width: number; height: number }[] = [];
    for (const entry of entries) {
      const rect = entry.element.getBoundingClientRect();
      const scale = Math.max(this._scale, 0.001);
      measurements.push({
        nodeId: entry.nodeId,
        width: rect.width / scale,
        height: rect.height / scale,
      });
    }

    // Write phase: update registry in one batch
    for (const m of measurements) {
      this._sizeRegistry.setMeasuredSize(m.nodeId, { width: m.width, height: m.height });
      this._queue.delete(m.nodeId);
      if (this._onSizeChanged) {
        this._onSizeChanged(m.nodeId);
      }
    }

    // If more items remain, schedule the next batch
    if (this._queue.size > 0) {
      this._scheduleProcessing();
    }
  }

  public clear(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._queue.clear();

    if (this._resizeObserver) {
      const observer = this._resizeObserver;
      this._observedElements.forEach((element) => {
        observer.unobserve(element);
      });
      this._observedElements.clear();
    }
  }
}
