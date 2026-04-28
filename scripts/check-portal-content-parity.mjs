// Compare the rendered markdown content between two portal deployments
// (typically prod vs local). Catches accidental content drift caused by
// markdown moves, whitespace stripping, or template changes.
//
// Strategy: pull the inner text of the page's <markdown-renderer>
// element from each origin, normalise whitespace, and diff line-by-line.
//
// Pages that are not markdown-driven (home, services) have no
// <markdown-renderer>; they are reported as `SKIPPED` rather than
// failing — those pages are pure Angular components and need a
// different verification approach.
//
// Usage:
//   1. npm run seo:check     # generates tmp/portal-routes.txt
//   2. npm run dev           # serves local
//   3. node scripts/check-portal-content-parity.mjs
//
// Optional env overrides:
//   BASELINE_ORIGIN  default: https://flow.foblex.com
//   LOCAL_ORIGIN     default: http://localhost:4200
//   ROUTES_FILE      default: tmp/portal-routes.txt
//   SHOW_DIFF_LINES  default: 5  (how many context lines to print on first divergence)
//
// Exit code: 0 when all comparable pages match; 1 when any page diverges
// or local fails to respond.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = process.cwd();
const BASELINE_ORIGIN = process.env.BASELINE_ORIGIN ?? 'https://flow.foblex.com';
const LOCAL_ORIGIN = process.env.LOCAL_ORIGIN ?? 'http://localhost:4200';
const ROUTES_FILE = resolve(REPO_ROOT, process.env.ROUTES_FILE ?? 'tmp/portal-routes.txt');
const SHOW_DIFF_LINES = Number(process.env.SHOW_DIFF_LINES ?? 5);

if (!existsSync(ROUTES_FILE)) {
  console.error(
    `[check-portal-content-parity] Route list not found at ${ROUTES_FILE}\n` +
      `  Run \`npm run seo:check\` first.`,
  );
  process.exit(1);
}

const routes = readFileSync(ROUTES_FILE, 'utf8')
  .split('\n')
  .map((r) => r.trim())
  .filter(Boolean);

console.log(
  `Comparing markdown content for ${routes.length} routes\n  baseline = ${BASELINE_ORIGIN}\n  local    = ${LOCAL_ORIGIN}\n`,
);

const tally = { ok: 0, diff: 0, skipped: 0, baselineMissing: 0, localFail: 0 };
const issues = [];

for (const route of routes) {
  const baselineUrl = route === '/' ? BASELINE_ORIGIN : `${BASELINE_ORIGIN}${route}`;
  const localUrl = route === '/' ? LOCAL_ORIGIN : `${LOCAL_ORIGIN}${route}`;

  const [baseline, local] = await Promise.all([fetchSafe(baselineUrl), fetchSafe(localUrl)]);

  if (!local.ok) {
    tally.localFail += 1;
    issues.push({ route, kind: 'local-fail', detail: local.error });
    continue;
  }

  if (!baseline.ok) {
    tally.baselineMissing += 1;
    issues.push({ route, kind: 'baseline-missing', detail: baseline.error });
    continue;
  }

  const baselineText = extractContent(baseline.html);
  const localText = extractContent(local.html);

  if (baselineText == null || localText == null) {
    tally.skipped += 1;
    issues.push({
      route,
      kind: 'skipped',
      detail: 'No <markdown-renderer> on baseline or local (likely a non-markdown page)',
    });
    continue;
  }

  if (baselineText === localText) {
    tally.ok += 1;
  } else {
    tally.diff += 1;
    issues.push({
      route,
      kind: 'content',
      baselineLength: baselineText.length,
      localLength: localText.length,
      preview: firstDivergence(baselineText, localText),
    });
  }
}

console.log(
  `Results: OK=${tally.ok}  DIFF=${tally.diff}  SKIPPED=${tally.skipped}  ` +
    `BASELINE_MISSING=${tally.baselineMissing}  LOCAL_FAIL=${tally.localFail}\n`,
);

const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
for (const issue of issues) {
  if (issue.kind === 'skipped' && !verbose) continue;
  if (issue.kind === 'baseline-missing' && !verbose) continue;

  console.log(`==== ${issue.route} (${issue.kind}) ====`);
  if (issue.kind !== 'content') {
    console.log(`  ${issue.detail}`);
    continue;
  }

  console.log(`  length: baseline=${issue.baselineLength} local=${issue.localLength}`);
  if (issue.preview) {
    console.log(`  first divergence around line ${issue.preview.line}:`);
    for (const block of issue.preview.context) {
      console.log(`    ${block}`);
    }
  }
}

if ((tally.skipped > 0 || tally.baselineMissing > 0) && !verbose) {
  console.log(
    `\n(${tally.skipped} skipped, ${tally.baselineMissing} baseline-missing — pass --verbose to list)`,
  );
}

const failed = tally.diff > 0 || tally.localFail > 0;
process.exit(failed ? 1 : 0);

async function fetchSafe(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'check-portal-content-parity/1.0' } });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    const html = await res.text();
    return { ok: true, html };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function extractContent(html) {
  const match = html.match(/<markdown-renderer[^>]*>([\s\S]*?)<\/markdown-renderer>/i);
  if (!match) return null;

  // Strip the footer component — its Previous/Next labels reflect the
  // current sidebar order, which legitimately drifts between deploys
  // when navigation is reorganised.
  let inner = match[1].replace(/<markdown-footer[^>]*>[\s\S]*?<\/markdown-footer>/gi, '');

  // Strip code blocks before whitespace normalisation so indentation
  // inside <pre><code> isn't artificially collapsed.
  inner = inner.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, ' [code-block] ');

  // Strip showcase/example viewer blocks — they often contain dynamic
  // example components whose text content can vary across deploys.
  inner = inner.replace(/<f-showcase[^>]*>[\s\S]*?<\/f-showcase>/gi, ' [showcase] ');
  inner = inner.replace(/<external-component[^>]*>[\s\S]*?<\/external-component>/gi, ' [example] ');

  // Drop all remaining tags
  let text = inner.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  text = decodeHtml(text);

  // Collapse whitespace; convert NBSP to regular space
  text = text.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();

  return text;
}

function decodeHtml(s) {
  return s
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&nbsp;', ' ')
    .replaceAll(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replaceAll(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function firstDivergence(baseline, local) {
  // Find character-level divergence, then map to a small word-window for context.
  let i = 0;
  while (i < baseline.length && i < local.length && baseline[i] === local[i]) i += 1;

  if (i === baseline.length && i === local.length) return null;

  const window = 80;
  const start = Math.max(0, i - window);
  const baselineSlice = baseline.slice(start, i + window);
  const localSlice = local.slice(start, i + window);

  return {
    line: i,
    context: [
      `BASELINE: …${baselineSlice}…`,
      `LOCAL   : …${localSlice}…`,
    ].slice(0, SHOW_DIFF_LINES * 2),
  };
}
