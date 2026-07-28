import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { createServer } from 'node:net';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { basename, join, relative, sep } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const MARKDOWN_ROOT = join(ROOT, 'apps', 'f-flow-portal', 'public', 'markdown');
const CANONICAL_ORIGIN = 'https://flow.foblex.com';
const LEGACY_PORTAL_HOST = 'foblex-flow-5378d59922a2.herokuapp.com';
const PORTAL_SERVER = join(ROOT, 'dist', 'f-flow-portal', 'server', 'server.mjs');
const PORTAL_BROWSER = join(ROOT, 'dist', 'f-flow-portal', 'browser');

const EMBEDDED_REFERENCE_APPS = [
  'schema-designer',
  'call-center',
  'marketing-automation',
  'tournament-bracket',
  'uml-diagram-example',
];

let serverProcess;
let baseUrl;

describe('Portal prerendered pages', () => {
  before(async () => {
    assert.ok(
      existsSync(PORTAL_SERVER),
      'Portal server build is missing. Run the portal build first.',
    );
    assert.ok(
      existsSync(PORTAL_BROWSER),
      'Portal browser build is missing. Run the portal build first.',
    );

    for (const appName of EMBEDDED_REFERENCE_APPS) {
      const appDistPath = getEmbeddedAppDistPath(appName);
      assert.ok(existsSync(appDistPath), `Embedded app build is missing for ${appName}.`);
    }

    const port = await getFreePort();
    baseUrl = `http://127.0.0.1:${port}`;
    serverProcess = spawn('node', [PORTAL_SERVER], {
      cwd: ROOT,
      env: { ...process.env, PORT: String(port) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderr = '';
    serverProcess.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    serverProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(stderr);
      }
    });

    await waitForServer(baseUrl);
  });

  after(() => {
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill('SIGTERM');
    }
  });

  test('section root redirects are correct', async () => {
    await assertRedirect('/docs', '/docs/intro');
    await assertRedirect('/docs/?utm_source=legacy', '/docs/intro?utm_source=legacy');
    await assertRedirect('/examples', '/examples/overview');
    await assertRedirect('/showcase', '/showcase/overview');
    await assertRedirect('/blog', '/blog/overview');
    await assertRedirect('/docs/consulting', '/services');
  });

  test('legacy docs URLs redirect once to canonical pages', async (t) => {
    const cases = [
      ['/docs/en', '/docs/intro'],
      ['/docs/en/', '/docs/intro'],
      ['/docs/en/get-started', '/docs/get-started'],
      ['/docs/en/get-started/', '/docs/get-started'],
      ['/docs/en/f-draggable-directive/', '/docs/f-draggable-directive'],
      [
        '/docs/en/angular-workflow-builder?return=/docs/en/get-started?source=legacy',
        '/docs/angular-workflow-builder?return=/docs/en/get-started?source=legacy',
      ],
    ];

    for (const [legacyRoute, canonicalRoute] of cases) {
      await t.test(legacyRoute, async () => {
        await assertRedirect(legacyRoute, canonicalRoute);

        const canonicalPath = canonicalRoute.split('?')[0];
        const response = await fetchText(`${baseUrl}${canonicalPath}`);

        assert.equal(response.status, 200);
        assert.match(
          response.body,
          new RegExp(
            `<link rel="canonical" href="${escapeRegExp(`${CANONICAL_ORIGIN}${canonicalPath}`)}"`,
            'u',
          ),
        );
      });
    }
  });

  test('legacy Heroku host permanently redirects to the canonical origin', async () => {
    const response = await requestWithHeaders(`${baseUrl}/docs/en/get-started/?source=legacy`, {
      Host: LEGACY_PORTAL_HOST,
    });

    assert.equal(response.status, 308);
    assert.equal(response.location, `${CANONICAL_ORIGIN}/docs/get-started?source=legacy`);
  });

  test('canonical host permanently redirects proxy-forwarded HTTP to HTTPS', async () => {
    const response = await requestWithHeaders(`${baseUrl}/docs/get-started?source=http`, {
      Host: 'flow.foblex.com',
      'X-Forwarded-Proto': 'http',
    });

    assert.equal(response.status, 308);
    assert.equal(response.location, `${CANONICAL_ORIGIN}/docs/get-started?source=http`);
  });

  test('canonical proxy-forwarded HTTPS does not enter a redirect loop', async () => {
    const response = await requestWithHeaders(`${baseUrl}/docs/get-started`, {
      Host: 'flow.foblex.com',
      'X-Forwarded-Proto': 'https',
    });

    assert.equal(response.status, 200);
  });

  test('retired undo/redo examples redirect to managed state', async () => {
    await assertRedirect('/examples/undo-redo', '/examples/state');
    await assertRedirect('/examples/undo-redo-v2', '/examples/state');
    await assertRedirect('/examples/undo-redo?source=legacy', '/examples/state?source=legacy');
  });

  test('robots and sitemap endpoints are served correctly', async () => {
    const robots = await fetchText(`${baseUrl}/robots.txt`);
    assert.match(robots.body, /Sitemap:\s+https:\/\/flow\.foblex\.com\/sitemap\.xml/u);

    const expectations = collectMarkdownExpectations();
    const visibleRoutes = expectations.filter((item) => !item.noindex);
    const sitemap = await fetchText(`${baseUrl}/sitemap.xml`);

    assert.match(sitemap.contentType, /xml/u);
    assert.match(sitemap.body, /<urlset/u);

    for (const item of visibleRoutes) {
      const loc = item.route === '/' ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${item.route}`;
      assert.match(sitemap.body, new RegExp(`<loc>${escapeRegExp(loc)}</loc>`, 'u'));
    }

    const noindexRoutes = expectations.filter((item) => item.noindex);

    for (const item of noindexRoutes) {
      assert.doesNotMatch(
        sitemap.body,
        new RegExp(`<loc>${escapeRegExp(`${CANONICAL_ORIGIN}${item.route}`)}</loc>`, 'u'),
      );
    }
  });

  test('documentation and articles publish route-specific structured data', async () => {
    const docs = await fetchText(`${baseUrl}/docs/get-started`);

    assert.equal(docs.status, 200);
    assert.match(docs.body, /data-ld-id="m-render-page"/u);
    assert.match(docs.body, /"@type":"BreadcrumbList"/u);
    assert.match(docs.body, /"@type":"WebPage"/u);
    assert.match(docs.body, /"@id":"https:\/\/flow\.foblex\.com\/#website"/u);

    const article = await fetchText(
      `${baseUrl}/blog/designing-a-stateless-library-how-foblex-flow-avoids-owning-your-data`,
    );

    assert.equal(article.status, 200);
    assert.match(article.body, /"@type":"TechArticle"/u);
    assert.match(
      article.body,
      /"@id":"https:\/\/flow\.foblex\.com\/blog\/designing-a-stateless-library-how-foblex-flow-avoids-owning-your-data#article"/u,
    );
    assert.match(
      article.body,
      /"mainEntityOfPage":\{"@id":"https:\/\/flow\.foblex\.com\/blog\/designing-a-stateless-library-how-foblex-flow-avoids-owning-your-data#webpage"\}/u,
    );
    assert.match(article.body, /"datePublished":"2026-04-24"/u);
    assert.match(article.body, /"dateModified":"2026-07-28"/u);
    assert.match(article.body, /"@type":"Organization"/u);
    assert.match(article.body, /"name":"Foblex"/u);
    assert.doesNotMatch(article.body, /"@type":"Person"/u);
  });

  test('all markdown routes are present and render expected content', async (t) => {
    const expectations = collectMarkdownExpectations();

    for (const item of expectations) {
      await t.test(item.route, async () => {
        const response = await fetchText(`${baseUrl}${item.route}`);

        assert.equal(response.status, 200);
        assert.match(response.contentType, /text\/html/u);
        assert.match(response.body, /<title>.+<\/title>/u);

        const canonical =
          item.route === '/' ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${item.route}`;

        assert.match(
          response.body,
          new RegExp(`<link rel="canonical" href="${escapeRegExp(canonical)}"`, 'u'),
        );

        if (item.h1) {
          assert.match(response.body, new RegExp(escapeRegExp(item.h1), 'u'));
        }

        if (item.noindex) {
          assert.match(response.body, /<meta name="robots" content="noindex/u);
        } else {
          assert.doesNotMatch(response.body, /<meta name="robots" content="noindex/u);
        }
      });
    }
  });

  test('embedded reference apps are reachable through the portal server', async (t) => {
    for (const appName of EMBEDDED_REFERENCE_APPS) {
      await t.test(appName, async () => {
        const response = await fetchText(`${baseUrl}/embedded/${appName}/`);

        assert.equal(response.status, 200);
        assert.match(response.contentType, /text\/html/u);
        assert.match(response.body, /<app-root/u);
        assert.match(response.body, /<base href="\.\/"/u);
        assert.match(response.body, /main\.js/u);
      });
    }
  });

  test('unknown route returns a 404 page with noindex meta', async () => {
    const response = await fetchText(`${baseUrl}/definitely-missing-page`, { redirect: 'manual' });

    assert.equal(response.status, 404);
    assert.match(response.body, /404/u);
    assert.match(response.body, /<meta name="robots" content="noindex/u);
  });
});

function collectMarkdownExpectations() {
  const expectations = [
    {
      route: '/',
      h1: 'Build production node editors in Angular.',
      noindex: false,
    },
  ];

  for (const filePath of walkMarkdownFiles(MARKDOWN_ROOT)) {
    const content = readFileSync(filePath, 'utf8');
    const route = toRoutePath(filePath);

    if (!route) {
      continue;
    }

    expectations.push({
      route,
      h1: extractFirstHeading(content),
      noindex: /^noindex:\s*true\s*$/mu.test(content),
    });
  }

  return expectations.sort((left, right) => left.route.localeCompare(right.route));
}

function requestWithHeaders(url, headers) {
  const target = new URL(url);

  return new Promise((resolve, reject) => {
    const req = request(
      {
        hostname: target.hostname,
        port: target.port,
        path: `${target.pathname}${target.search}`,
        headers,
      },
      (response) => {
        response.resume();
        resolve({
          status: response.statusCode,
          location: response.headers.location,
        });
      },
    );

    req.on('error', reject);
    req.end();
  });
}

function walkMarkdownFiles(directoryPath) {
  const directoryEntries = readdirSync(directoryPath, { withFileTypes: true });
  const collectedFiles = [];

  for (const entry of directoryEntries) {
    const entryPath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      collectedFiles.push(...walkMarkdownFiles(entryPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      collectedFiles.push(entryPath);
    }
  }

  return collectedFiles;
}

function toRoutePath(filePath) {
  const relativePath = relative(MARKDOWN_ROOT, filePath);

  if (relativePath === '404.md') {
    return null;
  }

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

function extractFirstHeading(content) {
  const match = content.match(/^#\s+(.+)\s*$/mu);

  return match ? match[1].trim() : null;
}

async function assertRedirect(route, expectedLocation) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });

  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), expectedLocation);
}

async function fetchText(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    return {
      status: response.status,
      body: await response.text(),
      contentType: response.headers.get('content-type') ?? '',
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForServer(url) {
  const deadline = Date.now() + 30000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' });

      if (response.status > 0) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for server: ${url}`);
}

function getEmbeddedAppDistPath(appName) {
  switch (appName) {
    case 'schema-designer':
      return join(ROOT, 'dist', 'apps', 'example-apps', 'schema-designer', 'browser', 'index.html');
    case 'call-center':
      return join(ROOT, 'dist', 'apps', 'example-apps', 'call-center', 'browser', 'index.html');
    case 'marketing-automation':
      return join(
        ROOT,
        'dist',
        'apps',
        'example-apps',
        'marketing-automation',
        'browser',
        'index.html',
      );
    case 'tournament-bracket':
      return join(
        ROOT,
        'dist',
        'apps',
        'example-apps',
        'tournament-bracket',
        'browser',
        'index.html',
      );
    case 'uml-diagram-example':
      return join(ROOT, 'dist', 'apps', 'example-apps', 'uml-diagram', 'browser', 'index.html');
    default:
      throw new Error(`Unknown embedded app: ${appName}`);
  }
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.listen(0, '127.0.0.1', () => {
      const address = server.address();

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        if (!address || typeof address === 'string') {
          reject(new Error('Failed to allocate a TCP port.'));
          return;
        }

        resolve(address.port);
      });
    });

    server.on('error', reject);
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}
