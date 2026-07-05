import { inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const CLEAR_DELAY = 4000;

/**
 * Speaks editor feedback to assistive technology through a live region (WCAG 4.1.3 —
 * status messages must reach AT without moving focus).
 *
 * One visually-hidden element per politeness level is created lazily and reused for
 * the lifetime of the flow: screen readers reliably announce mutations of an existing
 * live region but often miss regions injected at announce time. Messages auto-clear so
 * a user navigating to the region later does not hear stale text. `'assertive'` is
 * reserved for interrupting feedback (destructive results, errors) — everything
 * routine goes through `'polite'`.
 */
@Injectable()
export class FA11yAnnouncer implements OnDestroy {
  private readonly _document = inject(DOCUMENT);

  private _regions = new Map<'polite' | 'assertive', HTMLElement>();
  private _clearTimer: ReturnType<typeof setTimeout> | undefined;

  public announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
    if (!this._document?.body) {
      return;
    }
    const region = this._resolveRegion(politeness);

    // Clearing first guarantees a mutation even when the same message repeats
    // (e.g. arrow key held) — otherwise AT sees no change and stays silent.
    region.textContent = '';
    region.textContent = message;

    clearTimeout(this._clearTimer);
    this._clearTimer = setTimeout(() => (region.textContent = ''), CLEAR_DELAY);
  }

  public ngOnDestroy(): void {
    clearTimeout(this._clearTimer);
    for (const region of this._regions.values()) {
      region.remove();
    }
    this._regions.clear();
  }

  private _resolveRegion(politeness: 'polite' | 'assertive'): HTMLElement {
    let region = this._regions.get(politeness);
    if (region) {
      return region;
    }

    region = this._document.createElement('div');
    region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    // Visually hidden but rendered — display:none would silence the live region.
    region.style.cssText =
      'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;';
    this._document.body.appendChild(region);
    this._regions.set(politeness, region);

    return region;
  }
}
