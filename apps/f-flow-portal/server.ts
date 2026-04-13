import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import bootstrap from './src/main.server';

const EMBEDDED_REFERENCE_APPS = {
  'db-management-flow': '../../apps/example-apps/schema-designer/browser',
  'schema-designer': '../../apps/example-apps/schema-designer/browser',
  'call-center': '../../apps/example-apps/call-center/browser',
  'uml-diagram-example': '../../apps/example-apps/uml-diagram/browser',
  'tournament-bracket': '../../apps/example-apps/tournament-bracket/browser',
} as const;

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  const renderNotFound = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const notFoundUrl = `${req.protocol}://${req.headers.host}/404`;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: notFoundUrl,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
      })
      .then((html) => res.status(404).send(applyNotFoundMeta(html, notFoundUrl)))
      .catch((err) => next(err));
  };

  server.get(['/docs', '/docs/'], (_req, res) => {
    res.redirect(301, '/docs/intro');
  });

  server.get(['/examples', '/examples/'], (_req, res) => {
    res.redirect(301, '/examples/overview');
  });

  server.get(['/showcase', '/showcase/'], (_req, res) => {
    res.redirect(301, '/showcase/overview');
  });

  server.get(['/blog', '/blog/'], (_req, res) => {
    res.redirect(301, '/blog/overview');
  });

  registerEmbeddedReferenceApps(server, serverDistFolder);

  server.use((req, res, next) => {
    const [pathOnly, query = ''] = req.url.split('?', 2);
    const legacyRedirect = resolveLegacyRedirect(pathOnly);

    if (legacyRedirect) {
      return res.redirect(301, legacyRedirect + (query ? '?' + query : ''));
    }

    // Keep canonical URLs without trailing slash across docs/examples/showcase/blog.
    if (pathOnly.length > 1 && !isAssetPath(pathOnly) && pathOnly.endsWith('/')) {
      const normalizedPath = pathOnly.replace(/\/+$/, '');

      return res.redirect(301, normalizedPath + (query ? '?' + query : ''));
    }
    next();
  });

  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1d',
      redirect: false,
      index: 'index.html',
    }),
  );

  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const pathname = normalizeRoutePath(req.path);

    if (isAssetPath(pathname)) return next();

    if (!hasPrerenderedRoute(browserDistFolder, pathname)) {
      return renderNotFound(req, res, next);
    }

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  server.use((req, res) => {
    res.status(404).send('Page not found');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server.use((err: any, req: any, res: any, _next: any): void => {
    console.error('Error occurred:', err.message);
    res.status(500).send('Internal Server Error');
  });

  return server;
}

function registerEmbeddedReferenceApps(server: express.Express, serverDistFolder: string): void {
  for (const [route, distRelativePath] of Object.entries(EMBEDDED_REFERENCE_APPS)) {
    const appDistFolder = resolve(serverDistFolder, distRelativePath);

    if (!existsSync(appDistFolder)) {
      continue;
    }

    server.use(
      `/embedded/${route}`,
      express.static(appDistFolder, {
        maxAge: '1d',
        redirect: false,
        index: 'index.html',
      }),
    );
  }
}

function normalizeRoutePath(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/';
  }
  const normalized = pathname.replace(/\/+$/, '');

  return normalized || '/';
}

function isAssetPath(pathname: string): boolean {
  return /\.[A-Za-z0-9]{1,8}$/.test(pathname);
}

function resolveLegacyRedirect(pathname: string): string | null {
  const normalized = normalizeRoutePath(pathname);

  if (normalized === '/docs/en') {
    return '/docs/intro';
  }

  if (normalized.startsWith('/docs/en/')) {
    const slug = normalized.slice('/docs/en/'.length);

    return slug ? `/docs/${slug}` : '/docs/intro';
  }

  if (normalized === '/examples/f-db-management-flow') {
    return '/examples/schema-designer';
  }

  return null;
}

function hasPrerenderedRoute(browserDistFolder: string, pathname: string): boolean {
  const normalized = normalizeRoutePath(pathname);

  if (normalized.includes('..')) {
    return false;
  }

  const htmlPath =
    normalized === '/'
      ? join(browserDistFolder, 'index.html')
      : join(browserDistFolder, normalized.replace(/^\/+/, ''), 'index.html');

  return existsSync(htmlPath);
}

function applyNotFoundMeta(html: string, canonicalUrl: string): string {
  const title = '404 - Page Not Found | Foblex Flow';
  const description =
    'The requested Foblex Flow page could not be found. Continue with the docs, examples, showcase, or articles.';

  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    )
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/,
      `<meta name="robots" content="noindex, nofollow, noarchive" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${description}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${title}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${description}" />`,
    );
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
