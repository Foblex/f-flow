import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const MARKDOWN_ROOT = join(ROOT, 'apps', 'f-flow-portal', 'public', 'markdown');
const ROUTES_PATH = join(ROOT, 'tmp', 'portal-routes.txt');
const SITEMAP_PATH = join(ROOT, 'tmp', 'sitemap.xml');
const CANONICAL_ORIGIN = 'https://flow.foblex.com';
const STATIC_INTERNAL_PATHS = new Set([
  '/llms.txt',
  '/llms-full.txt',
  '/robots.txt',
  '/sitemap.xml',
]);
const DEPRECATED_API_CODE_PATTERNS = [
  {
    label: 'legacy connector id (fOutputId/fInputId)',
    pattern: /\bf(?:Output|Input)Id\b/gu,
  },
  {
    label: 'legacy connector directive (fNodeOutput/fNodeInput/fNodeOutlet)',
    pattern: /\bfNode(?:Output|Input|Outlet)\b/gu,
  },
  {
    label: 'deprecated create-node field (event.rect)',
    pattern: /\bevent\.rect\b/gu,
  },
  {
    label: 'deprecated reassignment event field',
    pattern: /\b(?:old|new)(?:F)?(?:Input|Output|Source|Target)Id\b/gu,
  },
];
const HARDCODED_CURRENT_MAJOR_PATTERN = /\bcurrent\s+`?v?\d+\.x`?(?:\s+line)?\b/giu;

const markdownFiles = walkMarkdownFiles(MARKDOWN_ROOT);
const generatedRoutes = readFileSync(ROUTES_PATH, 'utf8')
  .split(/\r?\n/u)
  .map((route) => route.trim())
  .filter(Boolean);
const sitemap = readFileSync(SITEMAP_PATH, 'utf8');
const issues = [];
const noindexRoutes = [];
const expectedRoutes = new Set(['/']);
const knownRoutes = new Set(generatedRoutes);
let checkedInternalLinks = 0;

for (const filePath of markdownFiles) {
  const content = readFileSync(filePath, 'utf8');
  const route = toRoutePath(filePath);
  const noindex = /^noindex:\s*true\s*$/m.test(content);

  if (route && !noindex) {
    expectedRoutes.add(route);
  }

  if (noindex) {
    if (route) {
      noindexRoutes.push(route);
    }
  }

  // Orphan markdown can be an intentional redirect stub rather than a rendered
  // portal page. Validate links only for routes the portal actually registers.
  if (route && knownRoutes.has(route)) {
    validateInternalLinks(filePath, route, content, knownRoutes, issues);

    if (!noindex) {
      validateDeprecatedApiExamples(filePath, content, issues);
      validateCurrentMajorClaims(filePath, content, issues);
    }
  }
}

for (const route of noindexRoutes) {
  if (sitemap.includes(`<loc>${CANONICAL_ORIGIN}${route}</loc>`)) {
    issues.push(`tmp/sitemap.xml: noindex route ${route} must not appear in the sitemap`);
  }
}

for (const route of expectedRoutes) {
  const loc = route === '/' ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${route}`;

  if (!sitemap.includes(`<loc>${loc}</loc>`)) {
    issues.push(`tmp/sitemap.xml: expected route ${route} is missing from the sitemap`);
  }
}

if (/<(?:changefreq|priority)>/u.test(sitemap)) {
  issues.push(
    'tmp/sitemap.xml: changefreq and priority should stay omitted because search engines ignore them',
  );
}

if (issues.length) {
  console.error('SEO content validation failed:\n');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

function validateDeprecatedApiExamples(filePath, content, collectedIssues) {
  if (/^allowDeprecatedApiExamples:\s*true\s*$/mu.test(content)) {
    return;
  }

  const fencedCodePattern = /^```[^\r\n]*\r?\n([\s\S]*?)^```\s*$/gmu;

  for (const blockMatch of content.matchAll(fencedCodePattern)) {
    const code = blockMatch[1];

    for (const { label, pattern } of DEPRECATED_API_CODE_PATTERNS) {
      pattern.lastIndex = 0;
      const match = pattern.exec(code);

      if (!match) {
        continue;
      }

      const codeOffset = blockMatch[0].indexOf(code);
      const absoluteIndex = blockMatch.index + codeOffset + match.index;

      collectedIssues.push(
        `${relative(ROOT, filePath)}:${getLineNumber(content, absoluteIndex)}: ${label} in an ` +
          'indexable code example; migrate it or add allowDeprecatedApiExamples: true only for ' +
          'an intentional legacy/migration page',
      );
    }
  }
}

function validateCurrentMajorClaims(filePath, content, collectedIssues) {
  HARDCODED_CURRENT_MAJOR_PATTERN.lastIndex = 0;

  for (const match of content.matchAll(HARDCODED_CURRENT_MAJOR_PATTERN)) {
    collectedIssues.push(
      `${relative(ROOT, filePath)}:${getLineNumber(content, match.index)}: avoid hardcoding ` +
        `"${match[0]}"; describe the API generation or inject the package version`,
    );
  }
}

console.log(
  `SEO content validation passed for ${markdownFiles.length} markdown files and ${checkedInternalLinks} internal links.`,
);

function walkMarkdownFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs);
}

function toRoutePath(filePath) {
  const relativePath = relative(MARKDOWN_ROOT, filePath);
  const [section, ...rest] = relativePath.split(sep);

  if (!rest.length) {
    return null;
  }

  const slug = basename(rest.join(sep), '.md');

  switch (section) {
    case 'guides':
      return `/docs/${slug}`;
    case 'examples':
      return `/examples/${slug}`;
    case 'blog':
      return `/blog/${slug}`;
    case 'showcase':
      return `/showcase/${slug}`;
    default:
      return null;
  }
}

function validateInternalLinks(filePath, sourceRoute, content, routes, collectedIssues) {
  const contentWithoutCode = content
    .replace(/^```[\s\S]*?^```\s*$/gmu, preserveLineBreaks)
    .replace(/`[^`\r\n]*`/gu, preserveLineBreaks);
  const markdownLinkPattern = /(?<!!)\[[^\]\r\n]*\]\(([^)\s]+)(?:\s+["'][^)]*)?\)/gu;

  for (const match of contentWithoutCode.matchAll(markdownLinkPattern)) {
    const href = match[1];

    if (href.startsWith('#') || /^(?:mailto|tel):/iu.test(href)) {
      continue;
    }

    let targetUrl;

    try {
      targetUrl = resolveMarkdownLink(href, sourceRoute);
    } catch {
      collectedIssues.push(
        `${relative(ROOT, filePath)}:${getLineNumber(contentWithoutCode, match.index)}: invalid link ${href}`,
      );
      continue;
    }

    if (targetUrl.origin !== CANONICAL_ORIGIN) {
      continue;
    }

    checkedInternalLinks += 1;

    const targetRoute = normalizeRoute(targetUrl.pathname);

    if (isStaticInternalPath(targetRoute) || routes.has(targetRoute)) {
      continue;
    }

    collectedIssues.push(
      `${relative(ROOT, filePath)}:${getLineNumber(contentWithoutCode, match.index)}: ` +
        `internal link ${href} resolves to missing route ${targetRoute}`,
    );
  }
}

function preserveLineBreaks(value) {
  return value.replace(/[^\r\n]/gu, ' ');
}

/**
 * Mirrors MarkdownService._normalizeLinks().
 *
 * Bare slugs stay inside the current documentation section. Links prefixed
 * with "./" are intentionally left untouched by m-render and therefore
 * resolve from the portal's <base href="/">. Do not replace this with the
 * browser's default URL(relative, currentRoute) behavior: that is not the
 * repository's markdown-link contract.
 */
function resolveMarkdownLink(href, sourceRoute) {
  if (href.startsWith('http') || href.startsWith('www')) {
    return new URL(href.startsWith('www') ? `https://${href}` : href);
  }

  if (href.startsWith('./')) {
    return new URL(href.slice(2), `${CANONICAL_ORIGIN}/`);
  }

  const prefix = sourceRoute.substring(0, sourceRoute.lastIndexOf('/'));
  const normalizedHref = href.startsWith('/') ? `${prefix}${href}` : `${prefix}/${href}`;

  return new URL(normalizedHref, CANONICAL_ORIGIN);
}

function normalizeRoute(route) {
  if (!route || route === '/') {
    return '/';
  }

  return route.replace(/\/+$/u, '');
}

function isStaticInternalPath(route) {
  return (
    STATIC_INTERNAL_PATHS.has(route) ||
    route.startsWith('/embedded/') ||
    /\.[A-Za-z0-9]{1,8}$/u.test(route)
  );
}

function getLineNumber(content, index) {
  return content.slice(0, index).split(/\r?\n/u).length;
}
