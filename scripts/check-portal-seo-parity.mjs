// Compare SEO tags between two portal deployments — typically a baseline
// (production) and a local dev build — to catch regressions in <title>,
// description, canonical, og:*, and twitter:* tags.
//
// Usage:
//   1. Generate the route list:    npm run seo:check  (or run scripts/generate-portal-artifacts.mjs)
//      This writes tmp/portal-routes.txt.
//   2. Start the local dev server:  npm run dev
//   3. Run the parity check:        node scripts/check-portal-seo-parity.mjs
//
// Optional env overrides:
//   BASELINE_ORIGIN  default: https://flow.foblex.com
//   LOCAL_ORIGIN     default: http://localhost:4200
//   ROUTES_FILE      default: tmp/portal-routes.txt
//
// Exit code is 0 when every route matches (fetch errors against the
// baseline are allowed — they usually mean the route is new and not yet
// deployed). Exit code is 1 when at least one SEO field differs.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = process.cwd();
const BASELINE_ORIGIN = process.env.BASELINE_ORIGIN ?? 'https://flow.foblex.com';
const LOCAL_ORIGIN = process.env.LOCAL_ORIGIN ?? 'http://localhost:4200';
const ROUTES_FILE = resolve(REPO_ROOT, process.env.ROUTES_FILE ?? 'tmp/portal-routes.txt');

if (!existsSync(ROUTES_FILE)) {
  console.error(
    `[check-portal-seo-parity] Route list not found at ${ROUTES_FILE}\n` +
      `  Run \`node scripts/generate-portal-artifacts.mjs\` (or \`npm run seo:check\`) first.`,
  );
  process.exit(1);
}

const routes = readFileSync(ROUTES_FILE, 'utf8')
  .split('\n')
  .map((r) => r.trim())
  .filter(Boolean);

console.log(
  `Comparing ${routes.length} routes\n  baseline = ${BASELINE_ORIGIN}\n  local    = ${LOCAL_ORIGIN}\n`,
);

// (tag, attribute selector) — `null` for attribute means the bare tag (i.e. <title>)
const COMPARED_FIELDS = [
  ['title', null],
  ['meta', 'name=description'],
  ['meta', 'name=keywords'],
  ['meta', 'name=robots'],
  ['link', 'rel=canonical'],
  ['meta', 'property=og:title'],
  ['meta', 'property=og:description'],
  ['meta', 'property=og:url'],
  ['meta', 'property=og:type'],
  ['meta', 'property=og:image'],
  ['meta', 'property=og:image:width'],
  ['meta', 'property=og:image:height'],
  ['meta', 'property=og:image:type'],
  ['meta', 'property=og:site_name'],
  ['meta', 'property=og:locale'],
  ['meta', 'name=twitter:card'],
  ['meta', 'name=twitter:site'],
  ['meta', 'name=twitter:creator'],
  ['meta', 'name=twitter:title'],
  ['meta', 'name=twitter:description'],
  ['meta', 'name=twitter:image'],
];

const tally = { ok: 0, diff: 0, baselineMissing: 0, localFail: 0 };
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

  const diffs = diffSeo(extract(baseline.html), extract(local.html));
  if (diffs.length === 0) {
    tally.ok += 1;
  } else {
    tally.diff += 1;
    issues.push({ route, kind: 'seo', diffs });
  }
}

console.log(
  `Results: OK=${tally.ok}  DIFF=${tally.diff}  BASELINE_MISSING=${tally.baselineMissing}  LOCAL_FAIL=${tally.localFail}\n`,
);

for (const issue of issues) {
  console.log(`==== ${issue.route} (${issue.kind}) ====`);
  if (issue.kind !== 'seo') {
    console.log(`  ${issue.detail}`);
    continue;
  }
  for (const d of issue.diffs) {
    console.log(`  ${d.field}:`);
    console.log(`    BASELINE: ${truncate(d.baseline)}`);
    console.log(`    LOCAL   : ${truncate(d.local)}`);
  }
}

const failed = tally.diff > 0 || tally.localFail > 0;
process.exit(failed ? 1 : 0);

async function fetchSafe(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'check-portal-seo-parity/1.0' } });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    const html = await res.text();
    return { ok: true, html };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function extract(html) {
  const out = {};
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  out.title = titleMatch ? decodeHtml(titleMatch[1].trim()) : null;

  const metaPattern = /<meta\s+([^>]+?)\/?>/gi;
  let m;
  while ((m = metaPattern.exec(html)) !== null) {
    const attrs = parseAttrs(m[1]);
    if (attrs.name && attrs.content !== undefined) {
      out['meta:name=' + attrs.name] = decodeHtml(attrs.content);
    }
    if (attrs.property && attrs.content !== undefined) {
      out['meta:property=' + attrs.property] = decodeHtml(attrs.content);
    }
  }

  const linkPattern = /<link\s+([^>]+?)\/?>/gi;
  while ((m = linkPattern.exec(html)) !== null) {
    const attrs = parseAttrs(m[1]);
    if (attrs.rel && attrs.href) {
      out['link:rel=' + attrs.rel] = decodeHtml(attrs.href);
    }
  }

  return out;
}

function parseAttrs(input) {
  const out = {};
  const re = /(\w[\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(input)) !== null) {
    out[m[1].toLowerCase()] = m[3] !== undefined ? m[3] : m[4];
  }
  return out;
}

function decodeHtml(s) {
  return s.replaceAll(/&(amp|lt|gt|quot|#39|apos);/g, (_, entity) => {
    switch (entity) {
      case 'amp':
        return '&';
      case 'lt':
        return '<';
      case 'gt':
        return '>';
      case 'quot':
        return '"';
      case '#39':
      case 'apos':
        return "'";
      default:
        return _;
    }
  });
}

function diffSeo(baseline, local) {
  const diffs = [];
  for (const [tag, attr] of COMPARED_FIELDS) {
    const key = tag === 'title' ? 'title' : `${tag}:${attr}`;
    const baselineVal = normalize(baseline[key]);
    const localVal = normalize(local[key]);
    if (baselineVal !== localVal) {
      diffs.push({ field: key, baseline: baseline[key] ?? '', local: local[key] ?? '' });
    }
  }
  return diffs;
}

function normalize(value) {
  if (value == null) return '';
  // Substitute the local origin with the baseline origin so absolute URLs
  // (canonical, og:url, og:image) compare cleanly across hosts.
  return String(value).trim().replaceAll(LOCAL_ORIGIN, BASELINE_ORIGIN);
}

function truncate(s) {
  s = String(s ?? '');
  return s.length > 160 ? s.slice(0, 157) + '...' : s;
}
