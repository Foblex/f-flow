import { inject, Injectable, PLATFORM_ID, Signal, signal, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { STATS_FALLBACK, STATS_STATE_KEY, StatsSnapshot } from './stats-snapshot';

/**
 * Isomorphic stats holder.
 *
 * Server: `hydrate()` is called from an `provideAppInitializer` in
 * app.config.server.ts with a snapshot fetched by the Node-side
 * cache. The snapshot is copied into TransferState so hydration on
 * the client reads it without a second HTTP round-trip.
 *
 * Client: the constructor reads TransferState, so by the time any
 * component subscribes to the `snapshot` signal the value is already
 * what SSR rendered — no flash, no layout shift.
 */
@Injectable({ providedIn: 'root' })
export class Stats {
  private readonly _state = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _snapshot = signal<StatsSnapshot>(STATS_FALLBACK);

  public readonly snapshot: Signal<StatsSnapshot> = this._snapshot.asReadonly();

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const hydrated = this._state.get<StatsSnapshot | null>(STATS_STATE_KEY, null);
      if (hydrated) {
        this._snapshot.set(hydrated);
      }
    }
  }

  public hydrate(data: StatsSnapshot): void {
    this._snapshot.set(data);

    if (!isPlatformBrowser(this._platformId)) {
      this._state.set(STATS_STATE_KEY, data);
    }
  }
}
