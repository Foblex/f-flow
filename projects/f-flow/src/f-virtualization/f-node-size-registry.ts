import { Injectable } from '@angular/core';

export interface INodeSizeEntry {
  estimatedSize: { width: number; height: number };
  measuredSize?: { width: number; height: number };
}

@Injectable()
export class FNodeSizeRegistry {
  private readonly _entries = new Map<string, INodeSizeEntry>();
  private _defaultEstimatedSize = { width: 200, height: 100 };

  public setDefaultEstimatedSize(size: { width: number; height: number }): void {
    this._defaultEstimatedSize = size;
  }

  public register(nodeId: string): void {
    if (!this._entries.has(nodeId)) {
      this._entries.set(nodeId, {
        estimatedSize: { ...this._defaultEstimatedSize },
      });
    }
  }

  public unregister(nodeId: string): void {
    this._entries.delete(nodeId);
  }

  public getSize(nodeId: string): { width: number; height: number } {
    const entry = this._entries.get(nodeId);
    if (!entry) {
      return { ...this._defaultEstimatedSize };
    }

    return entry.measuredSize ?? entry.estimatedSize;
  }

  public getMeasuredSize(nodeId: string): { width: number; height: number } | undefined {
    return this._entries.get(nodeId)?.measuredSize;
  }

  public setMeasuredSize(nodeId: string, size: { width: number; height: number }): void {
    const entry = this._entries.get(nodeId);
    if (entry) {
      entry.measuredSize = { width: size.width, height: size.height };
    }
  }

  public clearMeasuredSize(nodeId: string): void {
    const entry = this._entries.get(nodeId);
    if (entry) {
      entry.measuredSize = undefined;
    }
  }

  public has(nodeId: string): boolean {
    return this._entries.has(nodeId);
  }

  public clear(): void {
    this._entries.clear();
  }
}
