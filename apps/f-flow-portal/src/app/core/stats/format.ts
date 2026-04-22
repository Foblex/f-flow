/**
 * Formats a count for display next to a short label (e.g. "stars",
 * "weekly installs"). Null/undefined renders as an em-dash so the
 * layout doesn't collapse while data is absent.
 *
 * <1000  -> "457"
 * <10_000 -> "1.2K" / "9.9K"
 * <1_000_000 -> "12K" / "350K"
 * otherwise  -> "1.2M"
 */
export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (value < 1000) {
    return String(value);
  }
  if (value < 10_000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  if (value < 1_000_000) {
    return `${Math.round(value / 1000)}K`;
  }

  return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

/** Ensures the returned string is prefixed with `v`; em-dash for null. */
export function formatVersion(version: string | null | undefined): string {
  if (!version) {
    return '—';
  }

  return version.startsWith('v') ? version : `v${version}`;
}
