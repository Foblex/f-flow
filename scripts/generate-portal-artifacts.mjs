import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const MARKDOWN_ROOT = path.join(REPO_ROOT, 'apps/f-flow-portal/public/markdown');
const TMP_ROOT = path.join(REPO_ROOT, 'tmp');
const ROUTES_FILE = path.join(TMP_ROOT, 'portal-routes.txt');
const SITEMAP_FILE = path.join(TMP_ROOT, 'sitemap.xml');
const CANONICAL_ORIGIN = 'https://flow.foblex.com';
const ISO_DATE_PATTERN = /^(\d{4}-\d{2}-\d{2})/u;

const SECTION_CONFIG = new Map([
  ['guides', { routePrefix: 'docs', changefreq: 'weekly', priority: '0.9' }],
  ['examples', { routePrefix: 'examples', changefreq: 'weekly', priority: '0.8' }],
  ['showcase', { routePrefix: 'showcase', changefreq: 'monthly', priority: '0.7' }],
  ['blog', { routePrefix: 'blog', changefreq: 'monthly', priority: '0.7' }],
]);

await main();

async function main() {
  const markdownEntries = await collectMarkdownEntries(MARKDOWN_ROOT);
  const routes = buildRoutes(markdownEntries);
  const sitemapXml = buildSitemap(markdownEntries);

  await mkdir(TMP_ROOT, { recursive: true });
  await writeFile(ROUTES_FILE, routes.join('\n') + '\n', 'utf8');
  await writeFile(SITEMAP_FILE, sitemapXml, 'utf8');

  console.log(`Generated ${routes.length} routes in ${path.relative(REPO_ROOT, ROUTES_FILE)}`);
  console.log(`Generated sitemap in ${path.relative(REPO_ROOT, SITEMAP_FILE)}`);
}

async function collectMarkdownEntries(directoryPath) {
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
  const collectedEntries = [];

  for (const entry of directoryEntries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      collectedEntries.push(...(await collectMarkdownEntries(entryPath)));
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const relativePath = path.relative(MARKDOWN_ROOT, entryPath).split(path.sep).join('/');

    if (relativePath === '404.md') {
      continue;
    }

    const content = await readFile(entryPath, 'utf8');
    const metadata = extractMetadata(content);
    const route = mapMarkdownFileToRoute(relativePath);
    const routeInfo = getRouteInfo(route);
    const fileStat = await stat(entryPath);

    collectedEntries.push({
      route,
      noindex: metadata.noindex,
      lastmod: metadata.updatedAt ?? metadata.publishedAt ?? toIsoDate(fileStat.mtime),
      changefreq: routeInfo.changefreq,
      priority: routeInfo.priority,
    });
  }

  return collectedEntries.sort((left, right) => compareRoutes(left.route, right.route));
}

function buildRoutes(entries) {
  // Portal-owned pages that are NOT backed by a markdown file but
  // must still be prerendered at build time. Keep in sync with
  // app.routes.ts and with the "Portal-owned pages" block in the
  // sitemap below.
  const routes = new Set(['/', '/services']);

  entries.forEach((entry) => {
    routes.add(entry.route);
  });

  return Array.from(routes).sort(compareRoutes);
}

function buildSitemap(entries) {
  const visibleEntries = entries.filter((entry) => !entry.noindex);
  const latestLastmod =
    visibleEntries.reduce((latest, entry) => (entry.lastmod > latest ? entry.lastmod : latest), '1970-01-01');

  const sitemapEntries = [
    {
      loc: CANONICAL_ORIGIN,
      lastmod: latestLastmod,
      changefreq: 'weekly',
      priority: '1.0',
    },
    // Portal-owned pages not backed by a markdown file. Keep in sync
    // with app.routes.ts.
    {
      loc: `${CANONICAL_ORIGIN}/services`,
      lastmod: latestLastmod,
      changefreq: 'monthly',
      priority: '0.9',
    },
    ...visibleEntries.map((entry) => ({
      loc: `${CANONICAL_ORIGIN}${entry.route}`,
      lastmod: entry.lastmod,
      changefreq: entry.changefreq,
      priority: entry.priority,
    })),
  ];

  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  sitemapEntries.forEach((entry) => {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
    lines.push(`    <priority>${escapeXml(entry.priority)}</priority>`);
    lines.push('  </url>');
  });

  lines.push('</urlset>');

  return lines.join('\n') + '\n';
}

function extractMetadata(content) {
  return {
    noindex: /^noindex:\s*true\s*$/mu.test(content),
    publishedAt: extractDateField(content, 'publishedAt'),
    updatedAt: extractDateField(content, 'updatedAt'),
  };
}

function extractDateField(content, fieldName) {
  const match = content.match(new RegExp(`^${fieldName}:\\s*"?([^"\\n]+)"?\\s*$`, 'mu'));

  if (!match) {
    return null;
  }

  const value = match[1].trim();
  const isoDate = value.match(ISO_DATE_PATTERN);

  return isoDate ? isoDate[1] : null;
}

function mapMarkdownFileToRoute(relativePath) {
  const segments = relativePath.split('/');
  const [section, ...rest] = segments;
  const sectionConfig = SECTION_CONFIG.get(section);

  if (!sectionConfig) {
    throw new Error(`Unsupported markdown section for portal artifacts: ${relativePath}`);
  }

  const slugPath = rest.join('/').replace(/\.md$/u, '');

  if (!slugPath) {
    throw new Error(`Cannot derive route from markdown file: ${relativePath}`);
  }

  return `/${sectionConfig.routePrefix}/${slugPath}`;
}

function getRouteInfo(route) {
  for (const [section, config] of SECTION_CONFIG.entries()) {
    const prefix = `/${config.routePrefix}/`;

    if (route.startsWith(prefix)) {
      return config;
    }
  }

  throw new Error(`Unsupported route for portal artifacts: ${route}`);
}

function compareRoutes(left, right) {
  const leftWeight = getRouteWeight(left);
  const rightWeight = getRouteWeight(right);

  if (leftWeight !== rightWeight) {
    return leftWeight - rightWeight;
  }

  return left.localeCompare(right);
}

function getRouteWeight(route) {
  if (route === '/') {
    return 0;
  }

  if (route.startsWith('/docs/')) {
    return 1;
  }

  if (route.startsWith('/examples/')) {
    return 2;
  }

  if (route.startsWith('/showcase/')) {
    return 3;
  }

  if (route.startsWith('/blog/')) {
    return 4;
  }

  return 5;
}

function toIsoDate(value) {
  return value.toISOString().slice(0, 10);
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
