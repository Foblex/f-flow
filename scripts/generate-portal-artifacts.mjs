import { createRequire } from 'node:module';
import { mkdir, readFile, stat, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = process.cwd();
const TMP_ROOT = path.join(REPO_ROOT, 'tmp');
const ROUTES_FILE = path.join(TMP_ROOT, 'portal-routes.txt');
const SITEMAP_FILE = path.join(TMP_ROOT, 'sitemap.xml');
const MARKDOWN_ROOT = path.join(REPO_ROOT, 'apps/f-flow-portal/public/markdown');
const SECTIONS_ROOT = path.join(REPO_ROOT, 'apps/f-flow-portal/src/app/sections');
const STUB_PATH = path.join(TMP_ROOT, 'm-render-stub.cjs');
const CANONICAL_ORIGIN = 'https://flow.foblex.com';
const ISO_DATE_PATTERN = /^(\d{4}-\d{2}-\d{2})/u;

// section id -> { routePath, markdownDir, changefreq, priority }
//
// `routePath` and `markdownDir` mirror what each ISectionConfig declares.
// They are duplicated here intentionally: the script runs at build time
// before TypeScript compilation, and reading a hand-written index is
// cheaper than wiring an additional Angular dep. Keep in sync if a new
// section is added under apps/f-flow-portal/src/app/sections/.
const SECTION_REGISTRY = [
  { id: 'docs', routePath: '/docs', markdownDir: 'guides', changefreq: 'weekly', priority: '0.9' },
  { id: 'examples', routePath: '/examples', markdownDir: 'examples', changefreq: 'weekly', priority: '0.8' },
  { id: 'showcase', routePath: '/showcase', markdownDir: 'showcase', changefreq: 'monthly', priority: '0.7' },
  { id: 'blog', routePath: '/blog', markdownDir: 'blog', changefreq: 'monthly', priority: '0.7' },
];

// Portal-owned pages with no PageDefinition (rendered by their own
// Angular components in apps/f-flow-portal/src/app/pages/). Keep in sync
// with app.routes.ts.
const PORTAL_PAGES = [
  { route: '/', changefreq: 'weekly', priority: '1.0' },
  { route: '/services', changefreq: 'monthly', priority: '0.9' },
];

await main();

async function main() {
  const jiti = await createJitiLoader();
  const helpers = jiti(
    path.join(REPO_ROOT, 'libs/m-render/src/lib/documentation-page/page-config/derive-markdown-path.ts'),
  );
  const derivePageMarkdownPath = helpers.derivePageMarkdownPath;

  const entries = [];

  for (const section of SECTION_REGISTRY) {
    const pages = await loadSectionPages(jiti, section.id);
    const sectionEntries = await collectSectionEntries(section, pages, derivePageMarkdownPath);
    entries.push(...sectionEntries);
  }

  await reportOrphanMarkdownFiles(entries);

  const routes = buildRoutes(entries);
  const sitemapXml = buildSitemap(entries);

  await mkdir(TMP_ROOT, { recursive: true });
  await writeFile(ROUTES_FILE, routes.join('\n') + '\n', 'utf8');
  await writeFile(SITEMAP_FILE, sitemapXml, 'utf8');

  console.log(`Generated ${routes.length} routes in ${path.relative(REPO_ROOT, ROUTES_FILE)}`);
  console.log(`Generated sitemap in ${path.relative(REPO_ROOT, SITEMAP_FILE)}`);
}

async function createJitiLoader() {
  // m-render's barrel export pulls in Angular @Injectable services that
  // need the JIT compiler. The pages.ts files only need
  // `defineLazyComponent` (a pure factory). Stub it so jiti can load
  // pages.ts without booting Angular.
  await mkdir(TMP_ROOT, { recursive: true });
  await writeFile(
    STUB_PATH,
    `module.exports = {
  defineLazyComponent: (selector, loader) => ({ selector, component: loader }),
};
`,
    'utf8',
  );

  const here = fileURLToPath(import.meta.url);
  const require = createRequire(here);
  const { createJiti } = require('jiti');

  return createJiti(here, {
    interopDefault: true,
    alias: { '@foblex/m-render': STUB_PATH },
  });
}

async function loadSectionPages(jiti, sectionId) {
  const file = path.join(SECTIONS_ROOT, sectionId, `${sectionId}.pages.ts`);
  const mod = jiti(file);
  const exportName = `${sectionId.toUpperCase()}_PAGES`;
  const pages = mod[exportName];
  if (!Array.isArray(pages)) {
    throw new Error(`Expected ${exportName} array in ${path.relative(REPO_ROOT, file)}`);
  }
  return pages;
}

async function collectSectionEntries(section, pages, derivePageMarkdownPath) {
  const entries = [];

  for (const page of pages) {
    if (typeof page.slug !== 'string') {
      throw new Error(`[${section.id}] page is missing a string slug`);
    }
    if (/^https?:\/\//iu.test(page.slug)) {
      // External link (e.g. changelog → GitHub) — not a portal route
      continue;
    }

    const relative = derivePageMarkdownPath(page);
    if (!relative) continue;
    const markdownPath = path.join(MARKDOWN_ROOT, section.markdownDir, relative);
    const metadata = await readMarkdownMetadata(markdownPath);
    if (!metadata) {
      throw new Error(
        `[${section.id}] PageDefinition slug "${page.slug}" has no markdown file at ${path.relative(REPO_ROOT, markdownPath)}`,
      );
    }

    entries.push({
      sectionId: section.id,
      route: `${section.routePath}/${page.slug}`,
      markdownPath,
      noindex: metadata.noindex,
      lastmod: metadata.updatedAt ?? metadata.publishedAt ?? metadata.fileMtime,
      changefreq: section.changefreq,
      priority: section.priority,
    });
  }

  return entries.sort((left, right) => left.route.localeCompare(right.route));
}

async function readMarkdownMetadata(filePath) {
  let content;
  try {
    content = await readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }

  const fileStat = await stat(filePath);
  return {
    noindex: /^noindex:\s*true\s*$/mu.test(content),
    publishedAt: extractDateField(content, 'publishedAt'),
    updatedAt: extractDateField(content, 'updatedAt'),
    fileMtime: toIsoDate(fileStat.mtime),
  };
}

async function reportOrphanMarkdownFiles(entries) {
  const knownPaths = new Set(entries.map((entry) => entry.markdownPath));
  const orphans = [];

  for (const section of SECTION_REGISTRY) {
    const dir = path.join(MARKDOWN_ROOT, section.markdownDir);
    await collectOrphansFromDir(dir, knownPaths, orphans);
  }

  // 404.md is a special non-routable page used by m-render
  const filtered = orphans.filter((p) => path.basename(p) !== '404.md');
  if (filtered.length > 0) {
    console.warn(
      `[generate-portal-artifacts] WARNING: ${filtered.length} orphan markdown file(s) without a PageDefinition entry:`,
    );
    for (const orphan of filtered) {
      console.warn(`  - ${orphan}`);
    }
  }
}

async function collectOrphansFromDir(dir, knownPaths, orphans) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectOrphansFromDir(full, knownPaths, orphans);
    } else if (entry.isFile() && entry.name.endsWith('.md') && !knownPaths.has(full)) {
      orphans.push(path.relative(REPO_ROOT, full));
    }
  }
}

function buildRoutes(entries) {
  const routes = new Set(PORTAL_PAGES.map((page) => page.route));
  for (const entry of entries) {
    routes.add(entry.route);
  }
  return Array.from(routes).sort(compareRoutes);
}

function buildSitemap(entries) {
  const visibleEntries = entries.filter((entry) => !entry.noindex);
  const latestLastmod = visibleEntries.reduce(
    (latest, entry) => (entry.lastmod > latest ? entry.lastmod : latest),
    '1970-01-01',
  );

  const sitemapEntries = [
    ...PORTAL_PAGES.map((page) => ({
      loc: page.route === '/' ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${page.route}`,
      lastmod: latestLastmod,
      changefreq: page.changefreq,
      priority: page.priority,
    })),
    ...visibleEntries.map((entry) => ({
      loc: `${CANONICAL_ORIGIN}${entry.route}`,
      lastmod: entry.lastmod,
      changefreq: entry.changefreq,
      priority: entry.priority,
    })),
  ];

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

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

function extractDateField(content, fieldName) {
  const match = content.match(new RegExp(`^${fieldName}:\\s*"?([^"\\n]+)"?\\s*$`, 'mu'));
  if (!match) return null;
  const value = match[1].trim();
  const isoDate = value.match(ISO_DATE_PATTERN);
  return isoDate ? isoDate[1] : null;
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
  if (route === '/') return 0;
  if (route.startsWith('/docs/')) return 1;
  if (route.startsWith('/examples/')) return 2;
  if (route.startsWith('/showcase/')) return 3;
  if (route.startsWith('/blog/')) return 4;
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
