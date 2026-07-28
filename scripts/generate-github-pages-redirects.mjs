import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const MARKDOWN_ROOT = path.join(REPO_ROOT, 'apps', 'f-flow-portal', 'public', 'markdown');
const OUTPUT_ROOT = path.join(REPO_ROOT, 'tmp', 'github-pages-redirect');
const CANONICAL_ORIGIN = 'https://flow.foblex.com';

const SECTION_ROUTES = {
  guides: '/docs',
  examples: '/examples',
  showcase: '/showcase',
  blog: '/blog',
};

const redirects = new Map([
  ['/', '/'],
  ['/docs', '/docs/intro'],
  ['/examples', '/examples/overview'],
  ['/showcase', '/showcase/overview'],
  ['/blog', '/blog/overview'],
  ['/services', '/services'],
  ['/docs/consulting', '/services'],
  ['/examples/f-db-management-flow', '/examples/schema-designer'],
  ['/examples/undo-redo', '/examples/state'],
  ['/examples/undo-redo-v2', '/examples/state'],
  ['/examples/external-item', '/docs/f-external-item-directive'],
  ['/connection-behaviours', '/examples/connection-behaviours'],
]);

await main();

async function main() {
  await collectCurrentPortalRoutes();
  addLegacyEnglishDocsRoutes();

  await rm(OUTPUT_ROOT, { recursive: true, force: true });
  await mkdir(OUTPUT_ROOT, { recursive: true });

  for (const [sourceRoute, targetRoute] of redirects) {
    const outputPath =
      sourceRoute === '/'
        ? path.join(OUTPUT_ROOT, 'index.html')
        : path.join(OUTPUT_ROOT, sourceRoute.slice(1), 'index.html');

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, createRedirectHtml(targetRoute), 'utf8');
  }

  await writeFile(path.join(OUTPUT_ROOT, '404.html'), createFallbackHtml(), 'utf8');
  await writeFile(path.join(OUTPUT_ROOT, '.nojekyll'), '', 'utf8');

  console.log(
    `Generated ${redirects.size} GitHub Pages redirects in ${path.relative(REPO_ROOT, OUTPUT_ROOT)}`,
  );
}

async function collectCurrentPortalRoutes() {
  for (const [markdownDirectory, routePrefix] of Object.entries(SECTION_ROUTES)) {
    const directory = path.join(MARKDOWN_ROOT, markdownDirectory);
    const files = await walkMarkdownFiles(directory);

    for (const filePath of files) {
      const slug = path.basename(filePath, '.md');

      if (slug !== '404') {
        redirects.set(`${routePrefix}/${slug}`, `${routePrefix}/${slug}`);
      }
    }
  }
}

function addLegacyEnglishDocsRoutes() {
  redirects.set('/docs/en', '/docs/intro');

  for (const route of [...redirects.keys()]) {
    if (route.startsWith('/docs/')) {
      redirects.set(`/docs/en/${route.slice('/docs/'.length)}`, route);
    }
  }
}

async function walkMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entryPath);
    }
  }

  return files;
}

function createRedirectHtml(targetRoute) {
  const canonicalUrl = toCanonicalUrl(targetRoute);
  const serializedTarget = JSON.stringify(canonicalUrl);
  const escapedTarget = escapeHtml(canonicalUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Foblex Flow has moved</title>
    <meta name="description" content="Foblex Flow documentation has moved to flow.foblex.com.">
    <link rel="canonical" href="${escapedTarget}">
    <meta http-equiv="refresh" content="0;url=${escapedTarget}">
    <script>
      window.location.replace(${serializedTarget} + window.location.search + window.location.hash);
    </script>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { display: grid; min-height: 100vh; margin: 0; place-items: center; }
      main { max-width: 38rem; padding: 2rem; text-align: center; }
    </style>
  </head>
  <body>
    <main>
      <h1>Foblex Flow has moved</h1>
      <p>The current documentation is available at <a href="${escapedTarget}">${escapedTarget}</a>.</p>
    </main>
  </body>
</html>
`;
}

function createFallbackHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Foblex Flow has moved</title>
    <meta name="description" content="Foblex Flow documentation has moved to flow.foblex.com.">
    <link id="canonical" rel="canonical" href="${CANONICAL_ORIGIN}/">
    <meta http-equiv="refresh" content="0;url=${CANONICAL_ORIGIN}/">
    <script>
      (function () {
        var projectPrefix = '/f-flow';
        var pathname = window.location.pathname;
        if (pathname === projectPrefix || pathname.startsWith(projectPrefix + '/')) {
          pathname = pathname.slice(projectPrefix.length);
        }

        pathname = pathname.replace(/\\/+$/, '') || '/';

        if (pathname === '/docs/en') {
          pathname = '/docs/intro';
        } else if (pathname.startsWith('/docs/en/')) {
          pathname = '/docs/' + pathname.slice('/docs/en/'.length);
        }

        var legacyRoutes = {
          '/docs/consulting': '/services',
          '/examples/f-db-management-flow': '/examples/schema-designer',
          '/examples/undo-redo': '/examples/state',
          '/examples/undo-redo-v2': '/examples/state',
          '/examples/external-item': '/docs/f-external-item-directive',
          '/connection-behaviours': '/examples/connection-behaviours'
        };
        pathname = legacyRoutes[pathname] || pathname;

        var canonicalUrl = ${JSON.stringify(CANONICAL_ORIGIN)} + pathname;
        document.getElementById('canonical').href = canonicalUrl;
        window.location.replace(canonicalUrl + window.location.search + window.location.hash);
      })();
    </script>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { display: grid; min-height: 100vh; margin: 0; place-items: center; }
      main { max-width: 38rem; padding: 2rem; text-align: center; }
    </style>
  </head>
  <body>
    <main>
      <h1>Foblex Flow has moved</h1>
      <p>The current site is <a href="${CANONICAL_ORIGIN}/">${CANONICAL_ORIGIN}</a>.</p>
    </main>
  </body>
</html>
`;
}

function toCanonicalUrl(route) {
  return route === '/' ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${route}`;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
