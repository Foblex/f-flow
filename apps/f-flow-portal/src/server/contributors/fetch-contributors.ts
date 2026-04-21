/* eslint-disable @typescript-eslint/naming-convention */
import {
  CONTRIBUTORS_FALLBACK,
  Contributor,
  ContributorsSnapshot,
} from '../../app/core/contributors';

const GITHUB_REPO = 'Foblex/f-flow';

const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours — contributor list changes slowly.
const FETCH_TIMEOUT_MS = 5000;
const RECENT_COMMITS_PAGE_SIZE = 100;

interface CacheEntry {
  readonly data: ContributorsSnapshot;
  readonly expiresAt: number;
}

/**
 * Cache + single-flight state held at module scope so it's shared
 * across every SSR render the Node process handles — one snapshot
 * serves every request, every user, for the whole TTL window. The
 * `inflight` guard coalesces concurrent cache-misses onto a single
 * upstream call (prevents thundering-herd at TTL expiry).
 */
let cache: CacheEntry | null = null;
let inflight: Promise<ContributorsSnapshot> | null = null;

interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

interface GitHubCommit {
  author: { login: string } | null;
}

/**
 * Returns a contributors snapshot with process-level memoisation so
 * concurrent SSR renders don't hammer GitHub. Recency is derived from
 * the latest page of commits (single request): the author of the most
 * recent commit comes first, then the next distinct author, etc.
 * Contributors who don't appear in the recent-commits window fall
 * through to the end of the list, ordered by total contribution count.
 *
 * Unauth GitHub limit is 60 req/h per IP — we spend 2 per refresh, so
 * the 12h TTL leaves plenty of headroom even under heavy traffic.
 * Upstream failures degrade to an empty list (UI hides the whole
 * sub-section) rather than faking contributors.
 */
export async function fetchContributorsWithCache(): Promise<ContributorsSnapshot> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const data = await fetchFresh();
      cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };

      return data;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

async function fetchFresh(): Promise<ContributorsSnapshot> {
  try {
    const [contributors, recentAuthors] = await Promise.all([
      fetchContributors(),
      fetchRecentAuthors(),
    ]);
    const list = orderByRecency(contributors, recentAuthors);

    return { list, fetchedAt: Date.now() };
  } catch (error) {
    console.warn('[contributors] fetch failed:', error);

    return CONTRIBUTORS_FALLBACK;
  }
}

async function fetchContributors(): Promise<Contributor[]> {
  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contributors?per_page=100`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Foblex-Portal-SSR',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    },
  );
  if (!response.ok) {
    throw new Error(`github contributors: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as GitHubContributor[];

  return payload
    .filter((entry) => entry.type !== 'Bot' && !!entry.login)
    .map(
      (entry): Contributor => ({
        login: entry.login,
        avatarUrl: entry.avatar_url,
        htmlUrl: entry.html_url,
        contributions: entry.contributions,
      }),
    );
}

/**
 * First-seen order in the last page of commits ≈ recency order of
 * active contributors. One request, no extra rate-limit cost per
 * contributor.
 */
async function fetchRecentAuthors(): Promise<string[]> {
  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=${RECENT_COMMITS_PAGE_SIZE}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Foblex-Portal-SSR',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    },
  );
  if (!response.ok) {
    throw new Error(`github commits: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as GitHubCommit[];
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const commit of payload) {
    const login = commit.author?.login;
    if (!login || seen.has(login)) {
      continue;
    }
    seen.add(login);
    ordered.push(login);
  }

  return ordered;
}

function orderByRecency(contributors: Contributor[], recentLogins: string[]): Contributor[] {
  const byLogin = new Map<string, Contributor>(
    contributors.map((entry) => [entry.login, entry] as const),
  );

  const recent: Contributor[] = [];
  for (const login of recentLogins) {
    const hit = byLogin.get(login);
    if (hit) {
      recent.push(hit);
      byLogin.delete(login);
    }
  }

  // Anyone left hasn't committed in the last RECENT_COMMITS_PAGE_SIZE
  // commits — append them in GitHub's default order (by contributions).
  const rest = Array.from(byLogin.values());

  return [...recent, ...rest];
}
