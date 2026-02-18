import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

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

  server.use((req, res, next) => {
    const [pathOnly, query = ''] = req.url.split('?', 2);
    const isAsset = /\.[A-Za-z0-9]{1,8}$/.test(pathOnly);

    // Keep canonical URLs without trailing slash across docs/examples/showcase/blog.
    if (pathOnly.length > 1 && !isAsset && pathOnly.endsWith('/')) {
      const normalizedPath = pathOnly.replace(/\/+$/, '');

      return res.redirect(301, normalizedPath + (query ? '?' + query : ''));
    }
    next();
  });

  server.get('/:slug', (req, res, next) => {
    const { slug } = req.params;

    if (/\.[A-Za-z0-9]{1,8}$/.test(slug)) return next();

    if (!slug) return next();

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${req.protocol}://${req.headers.host}/404`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
      })
      .then((html) => res.status(404).send(html))
      .catch((err) => next(err));
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

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
