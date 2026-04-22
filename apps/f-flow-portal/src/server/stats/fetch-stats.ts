/* eslint-disable @typescript-eslint/naming-convention */
import { STATS_FALLBACK, StatsSnapshot } from '../../app/core/stats';

const GITHUB_REPO = 'Foblex/f-flow';
const NPM_PACKAGE = '@foblex/flow';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — stats change slowly.
const FETCH_TIMEOUT_MS = 5000;

interface CacheEntry {
  readonly data: StatsSnapshot;
  readonly expiresAt: number;
}

/**
 * Cache state is held at module scope so it's shared across every SSR
 * render the Node process handles — a single snapshot serves every
 * request, every user, for the whole TTL window. Not per-session, not
 * per-request.
 *
 * `inflight` is a single-flight guard: if a fetch is already in
 * progress when another request arrives with an expired cache, the
 * new request awaits the same promise instead of starting a second
 * fetch. This prevents a "thundering herd" on TTL expiry — only ONE
 * upstream call happens, and every pending request resolves from it.
 */
let cache: CacheEntry | null = null;
let inflight: Promise<StatsSnapshot> | null = null;

/**
 * Returns the shared stats snapshot. Individual upstream failures
 * fall back to `STATS_FALLBACK.<field>` — conservative real-world
 * defaults — so the UI never renders an em-dash or empty number.
 *
 * GitHub unauthenticated rate limit is 60 req/h per IP; npm has no
 * strict limit. The 1h TTL keeps us at one fetch per hour per process
 * even under heavy traffic, and the single-flight guard makes sure
 * concurrent cache-misses still result in a single upstream call.
 */
export async function fetchStatsWithCache(): Promise<StatsSnapshot> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const [stars, weeklyInstalls, yearlyInstalls, version] = await Promise.all([
        fetchWithLog('github stars', fetchGitHubStars),
        fetchWithLog('npm weekly installs', fetchNpmWeeklyInstalls),
        fetchWithLog('npm yearly installs', fetchNpmYearlyInstalls),
        fetchWithLog('npm latest version', fetchNpmLatestVersion),
      ]);

      const data: StatsSnapshot = {
        stars: stars ?? STATS_FALLBACK.stars,
        weeklyInstalls: weeklyInstalls ?? STATS_FALLBACK.weeklyInstalls,
        yearlyInstalls: yearlyInstalls ?? STATS_FALLBACK.yearlyInstalls,
        version: version ?? STATS_FALLBACK.version,
        license: 'MIT',
      };
      cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };

      return data;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

async function fetchWithLog<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[stats] ${label} fetch failed:`, error);

    return null;
  }
}

async function fetchGitHubStars(): Promise<number> {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Foblex-Portal-SSR',
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`github: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as { stargazers_count: number };

  return payload.stargazers_count;
}

async function fetchNpmWeeklyInstalls(): Promise<number> {
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(NPM_PACKAGE)}`,
    { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) },
  );
  if (!response.ok) {
    throw new Error(`npm downloads: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as { downloads: number };

  return payload.downloads;
}

async function fetchNpmYearlyInstalls(): Promise<number> {
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-year/${encodeURIComponent(NPM_PACKAGE)}`,
    { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) },
  );
  if (!response.ok) {
    throw new Error(`npm yearly downloads: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as { downloads: number };

  return payload.downloads;
}

async function fetchNpmLatestVersion(): Promise<string> {
  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(NPM_PACKAGE)}/latest`,
    { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) },
  );
  if (!response.ok) {
    throw new Error(`npm registry: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as { version: string };

  return payload.version;
}
