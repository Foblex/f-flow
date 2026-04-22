import { makeStateKey, StateKey } from '@angular/core';

/**
 * Single GitHub contributor as surfaced to the UI. We keep only the
 * fields the home page actually renders — avatar, login, profile URL,
 * total contribution count.
 */
export interface Contributor {
  readonly login: string;
  readonly avatarUrl: string;
  readonly htmlUrl: string;
  readonly contributions: number;
}

/**
 * Contributors list + the timestamp the server fetched it at. The
 * UI does not render the timestamp but we keep it in the snapshot so
 * future hydration can decide to skip or re-fetch.
 */
export interface ContributorsSnapshot {
  readonly list: Contributor[];
  readonly fetchedAt: number | null;
}

/**
 * Empty fallback used when every upstream call to the GitHub API
 * fails. Unlike the Stats snapshot we do NOT fake default contributor
 * names — showing fictitious usernames would mislead visitors into
 * thinking those accounts have actually contributed. The home-team
 * template hides the whole sub-section when the list is empty.
 */
export const CONTRIBUTORS_FALLBACK: ContributorsSnapshot = {
  list: [],
  fetchedAt: null,
};

export const CONTRIBUTORS_STATE_KEY: StateKey<ContributorsSnapshot> =
  makeStateKey<ContributorsSnapshot>('foblex.contributors');
