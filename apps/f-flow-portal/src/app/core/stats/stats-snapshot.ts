import { makeStateKey, StateKey } from '@angular/core';

/**
 * Project-level stats shown in the home + services heros. The SSR
 * fetcher substitutes fallback values for individual fields whose
 * upstream API call fails, so consumers can render without nulls;
 * we keep each field nullable in the type only for the transient
 * case before SSR hydrates (e.g. during a 404 render from a crawler
 * before the app initializer runs).
 */
export interface StatsSnapshot {
  readonly stars: number | null;

  readonly weeklyInstalls: number | null;

  readonly yearlyInstalls: number | null;

  readonly version: string | null;

  readonly license: 'MIT';
}

/**
 * Sensible real-world defaults used both as a static baseline and as
 * a fallback when an individual upstream API call fails. Numbers are
 * intentionally conservative so, if upstream is ever unreachable for
 * a long time, we still render truthful figures instead of em-dashes.
 */
export const STATS_FALLBACK: StatsSnapshot = {
  stars: 478,
  weeklyInstalls: 14_000,
  yearlyInstalls: 366_000,
  version: 'v18.6.0',
  license: 'MIT',
};

/** TransferState key SSR writes to / browser reads from. */
export const STATS_STATE_KEY: StateKey<StatsSnapshot> = makeStateKey<StatsSnapshot>('foblex.stats');
