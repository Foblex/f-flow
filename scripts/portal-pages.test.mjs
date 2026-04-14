import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { basename, join, relative, sep } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const MARKDOWN_ROOT = join(ROOT, 'apps', 'f-flow-portal', 'public', 'markdown');
const CANONICAL_ORIGIN = 'https://flow.foblex.com';
const PORTAL_SERVER = join(ROOT, 'dist', 'f-flow-portal', 'server', 'server.mjs');
const PORTAL_BROWSER = join(ROOT, 'dist', 'f-flow-portal', 'browser');

const EMBEDDED_REFERENCE_APPS = [
  'schema-designer',
  'call-center',
  'tournament-bracket',
  'uml-diagram-example',
];

let serverProcess;
let baseUrl;

describe('Portal prerendered pages', () => {
  before(async () => {
    assert.ok(existsSync(PORTAL_SERVER), 'Portal server build is missing. Run the portal build first.');
    assert.ok(existsSync(PORTAL_BROWSER), 'Portal browser build is missing. Run the portal build first.');

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
    await assertRedirect('/examples', '/examples/overview');
    await assertRedirect('/showcase', '/showcase/overview');
    await assertRedirect('/blog', '/blog/overview');
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

  test('all markdown routes are present and render expected content', async (t) => {
    const expectations = collectMarkdownExpectations();

    for (const item of expectations) {
      await t.test(item.route, async () => {
        const response = await fetchText(`${baseUrl}${item.route}`);

        assert.equal(response.status, 200);
        assert.match(response.contentType, /text\/html/u);
        assert.match(response.body, /<title>.+<\/title>/u);

        const canonical = item.route === '/' ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${item.route}`;

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
      h1: 'Foblex Flow',
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
    case 'tournament-bracket':
      return join(ROOT, 'dist', 'apps', 'example-apps', 'tournament-bracket', 'browser', 'index.html');
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
