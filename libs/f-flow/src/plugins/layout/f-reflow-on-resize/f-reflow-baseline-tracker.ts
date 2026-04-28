import { Injectable } from '@angular/core';
import { IRect } from '@foblex/2d';

/**
 * Per-node "last known rect" used to derive the baseline for the next resize.
 *
 * Independent from `FCache` so reflow works even when the cache feature is
 * disabled (its default state). Populated on every orchestrator invocation:
 * the first observation of a node has no baseline yet and produces no plan
 * — subsequent observations diff against the recorded rect.
 *
 * Not part of serialization — purely transient UI state.
 */
@Injectable()
export class FReflowBaselineTracker {
  private readonly _baselines = new Map<string, IRect>();

  public get(id: string): IRect | undefined {
    return this._baselines.get(id);
  }

  public set(id: string, rect: IRect): void {
    this._baselines.set(id, rect);
  }

  public delete(id: string): void {
    this._baselines.delete(id);
  }

  public clear(): void {
    this._baselines.clear();
  }
}
