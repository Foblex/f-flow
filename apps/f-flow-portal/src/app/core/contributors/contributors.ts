import { inject, Injectable, PLATFORM_ID, Signal, signal, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CONTRIBUTORS_FALLBACK,
  CONTRIBUTORS_STATE_KEY,
  ContributorsSnapshot,
} from './contributors-snapshot';

/**
 * Isomorphic contributors holder, mirrors the Stats service pattern.
 *
 * Server: `hydrate()` is called from a `provideAppInitializer` in
 * app.config.server.ts with the snapshot fetched by the Node-side
 * cache (12h TTL). The snapshot is copied into TransferState so the
 * client reads it without a second HTTP round-trip.
 *
 * Client: the constructor reads TransferState, so the first signal
 * read already matches what SSR rendered — no flash, no refetch.
 */
@Injectable({ providedIn: 'root' })
export class Contributors {
  private readonly _state = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _snapshot = signal<ContributorsSnapshot>(CONTRIBUTORS_FALLBACK);

  public readonly snapshot: Signal<ContributorsSnapshot> = this._snapshot.asReadonly();

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const hydrated = this._state.get<ContributorsSnapshot | null>(CONTRIBUTORS_STATE_KEY, null);
      if (hydrated) {
        this._snapshot.set(hydrated);
      }
    }
  }

  public hydrate(data: ContributorsSnapshot): void {
    this._snapshot.set(data);

    if (!isPlatformBrowser(this._platformId)) {
      this._state.set(CONTRIBUTORS_STATE_KEY, data);
    }
  }
}
